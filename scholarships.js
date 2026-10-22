
const supabaseClient = window.supabase.createClient(
"https://dflpqdnozwcrywnqfxyi.supabase.co",
"sb_publishable_RVYHFwCSR4998L5DuMQNQA_i-hqcbsb"
);

async function loadScholarships() {
const { data, error } = await supabaseClient
    .from("scholarships")
    .select("*");

if (error) {
    console.log("Error:", error.message);
    return;
}
console.log("Scholarship details:", data);
}

loadScholarships();
