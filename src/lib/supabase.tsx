import { createClient } from "@supabase/supabase-js";

const supabaseUrl = "https://pvinpigcsaqcthtvbeyl.supabase.co";
const supabaseKey = "sb_publishable_4E3Rn_b2W2etxSnbQnG9Mw_LBWLq8Tl";

export const supabase = createClient(supabaseUrl, supabaseKey);
