import { defineConfig } from "vite";
import { resolve } from "path";

export default defineConfig({
    build: {
        rollupOptions: {
            input: {
                home: resolve(__dirname, "index.html"),

                admin: resolve(__dirname, "admin/index.html"),
                login: resolve(__dirname, "admin/login.html"),
                orders: resolve(__dirname, "admin/orders.html"),
                order: resolve(__dirname, "admin/order.html"),
                customers: resolve(__dirname, "admin/customers.html"),
                customer: resolve(__dirname, "admin/customer.html"),
                failed: resolve(__dirname, "admin/failed-orders.html")
            }
        }
    }
});