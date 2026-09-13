/**
 * SKTrack — BaseService
 * Abstract base class for all Supabase service layers.
 * Provides standard CRUD operations, query building, and error handling.
 */

import supabase from './supabase';

export class BaseService {
  /**
   * @param {string} tableName - Supabase table name
   * @param {typeof import('../models/BaseModel').BaseModel} modelClass - Model class for hydration
   */
  constructor(tableName, modelClass = null) {
    this.tableName = tableName;
    this.supabase = supabase;
    this.modelClass = modelClass;
  }

  /**
   * Hydrate raw data into model instances (if modelClass is set).
   * @param {object|object[]} data
   * @returns {*}
   */
  _hydrate(data) {
    if (!this.modelClass) return data;
    if (Array.isArray(data)) return this.modelClass.fromArray(data);
    return this.modelClass.fromJSON(data);
  }

  /**
   * Handle Supabase errors consistently.
   * @param {object} error
   * @throws {Error}
   */
  _handleError(error) {
    console.error(`[${this.constructor.name}] Error:`, error);
    throw new Error(error.message || 'An unexpected error occurred');
  }

  /**
   * Get all records, optionally filtered and sorted.
   * @param {object} options
   * @param {object} options.filters - { column: value } equality filters
   * @param {string} options.orderBy - Column to sort by
   * @param {boolean} options.ascending - Sort direction
   * @param {number} options.limit - Max records
   * @param {number} options.offset - Skip records
   * @param {string} options.select - Select clause (default '*')
   * @returns {Promise<{ data: Array, count: number }>}
   */
  async getAll({
    filters = {},
    orderBy = 'created_at',
    ascending = false,
    limit = null,
    offset = null,
    select = '*',
  } = {}) {
    let query = this.supabase
      .from(this.tableName)
      .select(select, { count: 'exact' });

    // Apply equality filters
    for (const [column, value] of Object.entries(filters)) {
      if (value !== undefined && value !== null && value !== '') {
        if (Array.isArray(value)) {
          query = query.in(column, value);
        } else {
          query = query.eq(column, value);
        }
      }
    }

    // Apply ordering
    if (orderBy) {
      query = query.order(orderBy, { ascending });
    }

    // Apply pagination
    if (limit) {
      query = query.limit(limit);
    }
    if (offset) {
      query = query.range(offset, offset + (limit || 10) - 1);
    }

    const { data, error, count } = await query;

    if (error) this._handleError(error);

    return {
      data: this._hydrate(data || []),
      count: count || 0,
    };
  }

  /**
   * Get a single record by ID.
   * @param {string} id
   * @param {string} select - Select clause
   * @returns {Promise<*>}
   */
  async getById(id, select = '*') {
    const { data, error } = await this.supabase
      .from(this.tableName)
      .select(select)
      .eq('id', id)
      .maybeSingle();

    if (error) this._handleError(error);
    if (!data) return null;

    return this._hydrate(data);
  }

  /**
   * Create a new record.
   * @param {object} record - Data to insert
   * @returns {Promise<*>}
   */
  async create(record) {
    // If it's a model instance, serialize it
    const insertData = record.toJSON ? record.toJSON() : record;

    // Remove id if null (let DB generate it)
    if (!insertData.id) delete insertData.id;

    const { data, error } = await this.supabase
      .from(this.tableName)
      .insert(insertData)
      .select()
      .single();

    if (error) this._handleError(error);

    return this._hydrate(data);
  }

  /**
   * Update an existing record.
   * @param {string} id
   * @param {object} updates - Fields to update
   * @returns {Promise<*>}
   */
  async update(id, updates) {
    const updateData = updates.toJSON ? updates.toJSON() : { ...updates };
    delete updateData.id;
    delete updateData.created_at;
    updateData.updated_at = new Date().toISOString();

    const { data, error } = await this.supabase
      .from(this.tableName)
      .update(updateData)
      .eq('id', id)
      .select()
      .single();

    if (error) this._handleError(error);

    return this._hydrate(data);
  }

  /**
   * Delete a record by ID.
   * @param {string} id
   * @returns {Promise<boolean>}
   */
  async delete(id) {
    const { error } = await this.supabase
      .from(this.tableName)
      .delete()
      .eq('id', id);

    if (error) this._handleError(error);

    return true;
  }

  /**
   * Count records matching filters.
   * @param {object} filters
   * @returns {Promise<number>}
   */
  async count(filters = {}) {
    let query = this.supabase
      .from(this.tableName)
      .select('*', { count: 'exact', head: true });

    for (const [column, value] of Object.entries(filters)) {
      if (value !== undefined && value !== null) {
        query = query.eq(column, value);
      }
    }

    const { count, error } = await query;

    if (error) this._handleError(error);

    return count || 0;
  }

  /**
   * Check if a record exists by ID.
   * @param {string} id
   * @returns {Promise<boolean>}
   */
  async exists(id) {
    const { data, error } = await this.supabase
      .from(this.tableName)
      .select('id')
      .eq('id', id)
      .maybeSingle();

    if (error) this._handleError(error);

    return !!data;
  }

  /**
   * Search records by a text query across specified columns.
   * @param {string} query - Search text
   * @param {string[]} columns - Columns to search in
   * @param {object} options - Additional options
   * @returns {Promise<{ data: Array, count: number }>}
   */
  async search(query, columns, options = {}) {
    if (!query || !query.trim()) {
      return this.getAll(options);
    }

    let dbQuery = this.supabase
      .from(this.tableName)
      .select(options.select || '*', { count: 'exact' });

    // Build OR filter for text search
    const orConditions = columns
      .map((col) => `${col}.ilike.%${query}%`)
      .join(',');

    dbQuery = dbQuery.or(orConditions);

    if (options.orderBy) {
      dbQuery = dbQuery.order(options.orderBy, {
        ascending: options.ascending ?? false,
      });
    }

    if (options.limit) {
      dbQuery = dbQuery.limit(options.limit);
    }

    const { data, error, count } = await dbQuery;

    if (error) this._handleError(error);

    return {
      data: this._hydrate(data || []),
      count: count || 0,
    };
  }

  /**
   * Upsert a record (insert or update).
   * @param {object} record
   * @returns {Promise<*>}
   */
  async upsert(record) {
    const upsertData = record.toJSON ? record.toJSON() : record;

    const { data, error } = await this.supabase
      .from(this.tableName)
      .upsert(upsertData)
      .select()
      .single();

    if (error) this._handleError(error);

    return this._hydrate(data);
  }
}

export default BaseService;
