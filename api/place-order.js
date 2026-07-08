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
    const { customer, cart } = req.body;

    try {

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

        console.error("ORDER INSERT FAILED:", err);

        try {

            await supabase
                .from("failed_orders")
                .insert({
                    payment_id: customer.payment_id,
                    razorpay_order_id: customer.razorpay_order_id,
                    customer,
                    cart,
                    error_message: err.message,
                    resolved: false
                });

        } catch (logError) {

            console.error("Failed to log failed order:", logError);

        }

        return res.status(500).json({
            success: false,
            pending: true,
            message:
                "Payment received, but your order is still being confirmed."
        });

    }

}