import nodemailer from "nodemailer";

const transporter = nodemailer.createTransport({
  host: process.env.SMTP_HOST,
  port: Number(process.env.SMTP_PORT || 465),
  secure: true,
  auth: {
    user: process.env.SMTP_USER,
    pass: process.env.SMTP_PASS,
  },
});

type OrderEmailData = {
  customerName: string;
  customerEmail: string;
  orderNumber: string;
  totalAmount: number;
};

export async function sendPaymentConfirmationEmail(
  order: OrderEmailData
) {
  if (!process.env.SMTP_USER || !process.env.SMTP_PASS) {
    throw new Error("SMTP email configuration is missing");
  }

  await transporter.sendMail({
    from: `"Guzel Meraki Studio" <${process.env.SMTP_USER}>`,
    to: order.customerEmail,
    subject: `Payment Confirmed - ${order.orderNumber}`,
    html: `
      <!DOCTYPE html>
      <html>
        <body style="margin:0;padding:0;background:#FBF6F2;font-family:Arial,sans-serif;">
          <div style="max-width:600px;margin:40px auto;background:white;border-radius:16px;padding:35px;">
            
            <h1 style="color:#6B1F3D;margin-bottom:10px;">
              Guzel Meraki Studio
            </h1>

            <p style="color:#2B2320;font-size:16px;">
              Dear ${order.customerName},
            </p>

            <p style="color:#555;font-size:15px;line-height:1.6;">
              Your payment has been successfully confirmed.
              Thank you for shopping with Guzel Meraki Studio.
            </p>

            <div style="background:#FBF6F2;border-radius:12px;padding:20px;margin:25px 0;">
              <p style="margin:8px 0;">
                <strong>Order Number:</strong> ${order.orderNumber}
              </p>

              <p style="margin:8px 0;">
                <strong>Payment Status:</strong>
                <span style="color:#16803c;">PAID</span>
              </p>

              <p style="margin:8px 0;">
                <strong>Total Amount:</strong>
                Rs. ${order.totalAmount.toLocaleString()}
              </p>
            </div>

            <p style="color:#555;font-size:15px;line-height:1.6;">
              We have received your payment and your order is now being processed.
            </p>

            <p style="color:#2B2320;margin-top:30px;">
              Thank you,<br />
              <strong>Guzel Meraki Studio</strong>
            </p>

          </div>
        </body>
      </html>
    `,
  });
}