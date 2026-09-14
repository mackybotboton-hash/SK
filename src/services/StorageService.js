import supabase from './supabase';

/**
 * SKTrack — StorageService
 * Manages file uploads and URL generation via Supabase Storage.
 */
export class StorageService {
  constructor() {
    this.supabase = supabase;
  }

  /**
   * Uploads a file to the specified storage bucket
   * @param {string} bucketName - Name of the bucket (e.g. 'documents')
   * @param {File} file - Native File object
   * @param {string} path - Optional subpath (e.g. 'resolutions/my-file.pdf')
   * @returns {Promise<{ path: string, url: string, size: number, type: string }>}
   */
  async uploadFile(bucketName, file, path = null) {
    if (!file) throw new Error("No file provided for upload.");

    // Generate a unique path to prevent overwriting
    const fileExt = file.name.split('.').pop();
    const uniquePath = path || `${Date.now()}_${Math.random().toString(36).substring(7)}.${fileExt}`;

    const { data, error } = await this.supabase.storage
      .from(bucketName)
      .upload(uniquePath, file, {
        cacheControl: '3600',
        upsert: false
      });

    if (error) {
      console.error(`[StorageService] Upload Error:`, error);
      throw new Error(error.message || 'File upload failed');
    }

    const publicUrl = this.getPublicUrl(bucketName, data.path);

    return {
      path: data.path,
      url: publicUrl,
      size: file.size,
      type: file.type || fileExt
    };
  }

  /**
   * Gets the public URL for a file
   * @param {string} bucketName
   * @param {string} filePath
   * @returns {string}
   */
  getPublicUrl(bucketName, filePath) {
    const { data } = this.supabase.storage
      .from(bucketName)
      .getPublicUrl(filePath);
      
    return data.publicUrl;
  }

  /**
   * Deletes a file from storage
   * @param {string} bucketName
   * @param {string} filePath
   * @returns {Promise<boolean>}
   */
  async deleteFile(bucketName, filePath) {
    const { error } = await this.supabase.storage
      .from(bucketName)
      .remove([filePath]);

    if (error) {
      console.error(`[StorageService] Delete Error:`, error);
      throw new Error(error.message || 'File deletion failed');
    }
    
    return true;
  }
}

export const storageService = new StorageService();
export default storageService;
