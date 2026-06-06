import { NextResponse } from "next/server";
import nodemailer from "nodemailer";

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const {
      name,
      phone,
      email,
      serviceType,
      area,
      frequency,
      address,
      distance,
      transportPrice,
      estimatedPriceMin,
      estimatedPriceMax,
      extras = [],
      message = "",
    } = body;

    // Validation
    if (!name || !phone || !email) {
      return NextResponse.json(
        { error: "Jméno, telefon a e-mail jsou povinné údaje." },
        { status: 400 }
      );
    }

    // SMTP configuration
    // We check if custom SMTP settings are provided in env, otherwise we use a fallback or create a test account.
    const smtpHost = process.env.SMTP_HOST || "";
    const smtpPort = parseInt(process.env.SMTP_PORT || "587");
    const smtpUser = process.env.SMTP_USER || "";
    const smtpPass = process.env.SMTP_PASS || "";

    let transporter;

    if (smtpHost && smtpUser && smtpPass) {
      transporter = nodemailer.createTransport({
        host: smtpHost,
        port: smtpPort,
        secure: smtpPort === 465,
        auth: {
          user: smtpUser,
          pass: smtpPass,
        },
      });
    } else {
      // Fallback: create a test Ethereal account if no real SMTP details are present
      // This is extremely helpful for testing and local development without needing setups.
      console.log("⚠️ SMTP environment variables not configured. Creating Ethereal SMTP test transporter...");
      const testAccount = await nodemailer.createTestAccount();
      transporter = nodemailer.createTransport({
        host: "smtp.ethereal.email",
        port: 587,
        secure: false,
        auth: {
          user: testAccount.user,
          pass: testAccount.pass,
        },
      });
    }

    const serviceName = serviceType === "residence" ? "Rezidenční úklid (domácnost)" : "Komerční úklid (firma)";
    const extrasList = extras.length > 0 ? extras.map((e: string) => `<li>${e}</li>`).join("") : "<li>Žádné</li>";

    const mailOptions = {
      from: `"J. Pufr Poptávkový Systém" <no-reply@jpufr.cz>`,
      to: "gekoncicek@gmail.com", // Requested recipient for testing
      subject: `Nová poptávka: ${serviceName} - ${name}`,
      text: `
Nová poptávka od: ${name}
Telefon: ${phone}
E-mail: ${email}
Adresa realizace: ${address || "Neuvedeno"}
Vzdálenost (od Prahy 10): ${distance !== undefined ? `${distance} km` : "Neuvedeno"}
Cena dopravy: ${transportPrice !== undefined ? `${transportPrice} Kč` : "Neuvedeno"}

Specifikace:
- Typ úklidu: ${serviceName}
- Rozloha: ${area} m²
- Frekvence: ${frequency}
- Doplňkové služby: ${extras.length > 0 ? extras.join(", ") : "Žádné"}
- Orientační kalkulace: ${estimatedPriceMin} Kč - ${estimatedPriceMax} Kč

Zpráva od zákazníka:
${message || "Bez doprovodné zprávy."}
      `,
      html: `
        <div style="font-family: sans-serif; max-width: 600px; margin: 0 auto; padding: 20px; border: 1px solid #e2e8f0; border-radius: 4px; color: #1e293b;">
          <h2 style="color: #2563eb; border-bottom: 2px solid #e2e8f0; padding-bottom: 10px; margin-top: 0;">Nová poptávka úklidu</h2>
          
          <table style="width: 100%; border-collapse: collapse; margin-bottom: 20px;">
            <tr>
              <td style="padding: 8px 0; font-weight: bold; width: 180px;">Jméno / Firma:</td>
              <td style="padding: 8px 0;">${name}</td>
            </tr>
            <tr>
              <td style="padding: 8px 0; font-weight: bold;">Telefon:</td>
              <td style="padding: 8px 0;"><a href="tel:${phone}" style="color: #2563eb; text-decoration: none;">${phone}</a></td>
            </tr>
            <tr>
              <td style="padding: 8px 0; font-weight: bold;">E-mail:</td>
              <td style="padding: 8px 0;"><a href="mailto:${email}" style="color: #2563eb; text-decoration: none;">${email}</a></td>
            </tr>
            <tr>
              <td style="padding: 8px 0; font-weight: bold;">Adresa realizace:</td>
              <td style="padding: 8px 0;">${address || "<em>Neuvedeno</em>"}</td>
            </tr>
            <tr>
              <td style="padding: 8px 0; font-weight: bold;">Dojezdová vzdálenost:</td>
              <td style="padding: 8px 0;">${distance !== undefined ? `${distance} km` : "<em>Neuvedeno</em>"}</td>
            </tr>
            <tr>
              <td style="padding: 8px 0; font-weight: bold;">Cena dopravy (7 Kč/km):</td>
              <td style="padding: 8px 0;">${transportPrice !== undefined ? `${transportPrice} Kč` : "<em>Neuvedeno</em>"}</td>
            </tr>
          </table>

          <h3 style="color: #1e293b; border-bottom: 1px solid #e2e8f0; padding-bottom: 5px;">Specifikace zakázky</h3>
          <table style="width: 100%; border-collapse: collapse; margin-bottom: 20px;">
            <tr>
              <td style="padding: 8px 0; font-weight: bold; width: 180px;">Typ úklidu:</td>
              <td style="padding: 8px 0;">${serviceName}</td>
            </tr>
            <tr>
              <td style="padding: 8px 0; font-weight: bold;">Rozloha nemovitosti:</td>
              <td style="padding: 8px 0;">${area} m²</td>
            </tr>
            <tr>
              <td style="padding: 8px 0; font-weight: bold;">Frekvence úklidu:</td>
              <td style="padding: 8px 0;">${frequency}</td>
            </tr>
            <tr>
              <td style="padding: 8px 0; font-weight: bold; vertical-align: top;">Doplňkové služby:</td>
              <td style="padding: 8px 0; margin: 0;"><ul style="margin: 0; padding-left: 20px;">${extrasList}</ul></td>
            </tr>
            <tr style="background-color: #f8fafc;">
              <td style="padding: 12px 8px; font-weight: bold; color: #1e3a8a;">Orientační kalkulace:</td>
              <td style="padding: 12px 8px; font-weight: bold; color: #1e3a8a; font-size: 16px;">
                ${estimatedPriceMin.toLocaleString("cs-CZ")} Kč - ${estimatedPriceMax.toLocaleString("cs-CZ")} Kč
              </td>
            </tr>
          </table>

          <h3 style="color: #1e293b; border-bottom: 1px solid #e2e8f0; padding-bottom: 5px;">Poznámka / doplňující zpráva</h3>
          <p style="white-space: pre-wrap; background-color: #f8fafc; padding: 12px; border-radius: 4px; border: 1px solid #e2e8f0; font-style: italic; color: #475569;">
            ${message || "Bez doprovodné zprávy."}
          </p>
          
          <div style="margin-top: 30px; font-size: 11px; color: #94a3b8; text-align: center; border-top: 1px solid #e2e8f0; padding-top: 10px;">
            Tento e-mail byl automaticky vygenerován z poptávkového formuláře J. Pufr úklidové služby.
          </div>
        </div>
      `,
    };

    const info = await transporter.sendMail(mailOptions);
    
    // Log info if Ethereal was used (to get the preview URL)
    if (!smtpHost) {
      console.log("✉️ Ethereal Mail odeslán. Zpráva ID:", info.messageId);
      console.log("✉️ Ethereal Preview URL:", nodemailer.getTestMessageUrl(info));
      return NextResponse.json({
        success: true,
        message: "Poptávka byla úspěšně zpracována (Ethereal test mail).",
        previewUrl: nodemailer.getTestMessageUrl(info)
      });
    }

    return NextResponse.json({
      success: true,
      message: "Poptávka byla úspěšně odeslána na e-mail."
    });

  } catch (error: any) {
    console.error("Error sending email:", error);
    return NextResponse.json(
      { error: "Nepodařilo se odeslat e-mail. Zkuste to prosím znovu nebo nás kontaktujte telefonicky." },
      { status: 500 }
    );
  }
}
