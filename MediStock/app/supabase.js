import { createClient } from '@supabase/supabase-js';

// Replace with your Supabase credentials
const supabaseUrl = 'https://tixoowpisgkawepuwvqr.supabase.co';
const supabaseKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InRpeG9vd3Bpc2drYXdlcHV3dnFyIiwicm9sZSI6ImFub24iLCJpYXQiOjE3MzYwMzE5MzgsImV4cCI6MjA1MTYwNzkzOH0.zk6zLWclZ9L7lF3joqYDGJFEdpBNKs-gTvq465DcyR4';
export const supabase = createClient(supabaseUrl, supabaseKey);

export const fetchMedications = async () => {
    const { data, error } = await supabase
        .from('medications')
        .select('*')
        .order('created_at', { ascending: false });

    if (error) {
        console.error('Error fetching medications:', error);
        return [];
    }

    return data;
};

export const addMedication = async (name, quantity_in_stock, barcodes) => {
    const { data: { user }, error } = await supabase.auth.getUser();

    if (error) {
        console.error('Error fetching user:', error);
        return;
    }

    const email = user?.email;

    if (!email) {
        console.error('User is not logged in or email is not available!');
        return;
    }

    const { data, error: insertError } = await supabase
        .from('medications')
        .insert([
            {
                name,
                quantity_in_stock,
                barcodes,
                email
            }
        ]);

    if (insertError) {
        console.error('Error adding medication:', insertError);
    }

    return data;
};


export const updateMedication = async (id, newQuantity) => {
    console.log(id, newQuantity);
    const { data, error } = await supabase
        .from('medications')
        .update({ quantity_in_stock: newQuantity })
        .match({ id });

    if (error) {
        console.error('Error updating medication:', error);
    }

    return data;
};

export const getTotalStockQuantity = async () => {
    const { data, error } = await supabase
        .from('medications')
        .select('quantity_in_stock');

    if (error) {
        console.error("Error fetching stock:", error);
        return 0;
    }

    const totalStock = data.reduce((acc, medication) => acc + medication.quantity_in_stock, 0);
    console.log("Total Stock Quantity:", totalStock);
    return totalStock;
};

export const signUp = async (email, password) => {
    const { data, error } = await supabase.auth.signUp({
        email,
        password,
    });
    return { data, error };
};

export const signIn = async (email, password) => {
    const { data, error } = await supabase.auth.signInWithPassword({
        email,
        password,
    });
    return { data, error };
};

export const signOut = async () => {
    const { error } = await supabase.auth.signOut();
    return error;
};