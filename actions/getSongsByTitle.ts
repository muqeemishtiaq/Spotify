

import { createClientComponentClient } from '@supabase/auth-helpers-nextjs';
import { Song } from '@/types';

const getSongsByTitle = async (title: string): Promise<Song[]> => {
  const supabase = createClientComponentClient();

  const { data, error } = await supabase
    .from('songs')
    .select('*')
    .ilike('title', `%${title}%`)
    .order('created_at', { ascending: false });

  if (error) {
    console.error('Supabase error:', error);
    return [];
  }

  return data as Song[];
};

export default getSongsByTitle;
