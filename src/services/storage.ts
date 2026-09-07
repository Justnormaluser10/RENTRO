import { supabase, isSupabaseConfigured } from '../lib/supabase';

export const storageService = {
  /**
   * Uploads KYC driving licence or identity document to Supabase storage bucket 'kyc-documents'
   * or returns a local secure object URL if running locally.
   */
  async uploadKYCDocument(file: File, userId: string): Promise<{ url: string; error?: string }> {
    if (isSupabaseConfigured) {
      try {
        const fileExt = file.name.split('.').pop();
        const fileName = `${userId}/${Date.now()}-${Math.random().toString(36).substring(7)}.${fileExt}`;
        
        const { error: uploadError } = await supabase.storage
          .from('kyc-documents')
          .upload(fileName, file, {
            cacheControl: '3600',
            upsert: false,
          });

        if (uploadError) {
          console.warn('Supabase storage upload error:', uploadError);
          // Fallback to data URL
        } else {
          const { data } = supabase.storage
            .from('kyc-documents')
            .getPublicUrl(fileName);
          return { url: data.publicUrl };
        }
      } catch (err: any) {
        console.warn('Supabase storage exception:', err);
      }
    }

    // Local fallback: convert to base64 Data URL so it can be previewed seamlessly
    return new Promise((resolve) => {
      const reader = new FileReader();
      reader.onloadend = () => {
        resolve({ url: reader.result as string });
      };
      reader.onerror = () => {
        resolve({ url: '', error: 'Failed to read document file' });
      };
      reader.readAsDataURL(file);
    });
  },

  /**
   * Upload inspection condition photo
   */
  async uploadInspectionPhoto(file: File, bookingId: string): Promise<{ url: string; error?: string }> {
    if (isSupabaseConfigured) {
      try {
        const fileExt = file.name.split('.').pop();
        const fileName = `inspections/${bookingId}/${Date.now()}.${fileExt}`;
        
        const { error } = await supabase.storage
          .from('inspections')
          .upload(fileName, file);

        if (!error) {
          const { data } = supabase.storage.from('inspections').getPublicUrl(fileName);
          return { url: data.publicUrl };
        }
      } catch (err) {
        console.warn('Supabase inspection photo upload error:', err);
      }
    }

    return new Promise((resolve) => {
      const reader = new FileReader();
      reader.onloadend = () => {
        resolve({ url: reader.result as string });
      };
      reader.onerror = () => {
        resolve({ url: '', error: 'Failed to read photo' });
      };
      reader.readAsDataURL(file);
    });
  },
};
