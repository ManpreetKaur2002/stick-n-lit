import { createClient } from "@supabase/supabase-js";

const supabase = createClient(
    process.env.VITE_SUPABASE_URL,
    process.env.SUPABASE_SERVICE_ROLE_KEY
);

export default async function handler(req, res) {

    if (req.method !== "POST") {
        return res.status(405).json({
            success: false,
            message: "Method Not Allowed"
        });
    }

    try {

        const { customer, cart } = req.body;

        const { error } = await supabase.rpc(
            "place_complete_order",
            {
                customer_data: customer,
                cart_data: cart
            }
        );

        if (error) throw error;

        return res.status(200).json({
            success: true
        });

    } catch (err) {

        console.error(err);

        return res.status(500).json({
            success: false,
            message: err.message
        });

    }

}