import { NextResponse } from "next/server";
import nodemailer from "nodemailer";
import { siteConfig } from "@/lib/site";

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const {
      name,
      phone,
      email,
      serviceType,
      area,
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
    const smtpHost = process.env.SMTP_HOST || "";
    const smtpPort = parseInt(process.env.SMTP_PORT || "587");
    const smtpUser = process.env.SMTP_USER || "";
    const smtpPass = process.env.SMTP_PASS || "";

    // Odesílací adresa. Gmail přepíše hlavičku From na přihlášený účet, takže
    // musí odpovídat SMTP_USER (nebo ověřenému aliasu v Gmailu).
    const fromAddress = process.env.MAIL_FROM || smtpUser || "josefpufr@gmail.com";
    // Adresa, kam chodí notifikace o nových poptávkách.
    const ownerAddress = process.env.MAIL_TO || siteConfig.email;

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

    const isDetailed = !!serviceType;
    const serviceName = serviceType === "residence" ? "Rezidenční úklid (domácnost)" : "Komerční úklid (firma)";
    const extrasList = extras.length > 0 ? extras.map((e: string) => `<li>${e}</li>`).join("") : "<li>Žádné</li>";

    const subject = isDetailed 
      ? `Nová poptávka: ${serviceName} - ${name}`
      : `Obecná poptávka / zpráva - ${name}`;

    const textContent = isDetailed ? `
Nová poptávka od: ${name}
Telefon: ${phone}
E-mail: ${email}
Adresa realizace: ${address || "Neuvedeno"}
Vzdálenost (od Chýnova): ${distance !== undefined ? `${distance} km` : "Neuvedeno"}
Cena dopravy: ${transportPrice !== undefined ? `${transportPrice} Kč` : "Neuvedeno"}

Specifikace:
- Typ úklidu: ${serviceName}
- Rozloha: ${area} m²
- Doplňkové služby: ${extras.length > 0 ? extras.join(", ") : "Žádné"}
- Orientační kalkulace: ${estimatedPriceMin} Kč - ${estimatedPriceMax} Kč

Zpráva od zákazníka:
${message || "Bez doprovodné zprávy."}
    ` : `
Nová poptávka / zpráva od: ${name}
Telefon: ${phone}
E-mail: ${email}

Zpráva od zákazníka:
${message || "Bez doprovodné zprávy."}
    `;

    const htmlContent = isDetailed ? `
      <div style="font-family: sans-serif; max-width: 600px; margin: 0 auto; padding: 20px; border: 1px solid #e2e8f0; border-radius: 4px; color: #1e293b;">
        <h2 style="color: #2563eb; border-bottom: 2px solid #e2e8f0; padding-bottom: 10px; margin-top: 0;">Nová poptávka úklidu s kalkulací</h2>
        
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
    ` : `
      <div style="font-family: sans-serif; max-width: 600px; margin: 0 auto; padding: 20px; border: 1px solid #e2e8f0; border-radius: 4px; color: #1e293b;">
        <h2 style="color: #2563eb; border-bottom: 2px solid #e2e8f0; padding-bottom: 10px; margin-top: 0;">Nová obecná poptávka / zpráva</h2>
        
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
        </table>

        <h3 style="color: #1e293b; border-bottom: 1px solid #e2e8f0; padding-bottom: 5px;">Zpráva od zákazníka</h3>
        <p style="white-space: pre-wrap; background-color: #f8fafc; padding: 12px; border-radius: 4px; border: 1px solid #e2e8f0; font-style: italic; color: #475569;">
          ${message || "Bez doprovodné zprávy."}
        </p>
        
        <div style="margin-top: 30px; font-size: 11px; color: #94a3b8; text-align: center; border-top: 1px solid #e2e8f0; padding-top: 10px;">
          Tento e-mail byl automaticky vygenerován z poptávkového formuláře J. Pufr úklidové služby.
        </div>
      </div>
    `;

    const mailOptions = {
      from: `"J. Pufr Poptávkový Systém" <${fromAddress}>`,
      to: ownerAddress,
      // Odpověď na notifikaci půjde rovnou zákazníkovi.
      replyTo: `"${name}" <${email}>`,
      subject: subject,
      text: textContent,
      html: htmlContent,
    };

    // Client notification email
    const clientInfo = await transporter.sendMail(mailOptions);

    // Customer confirmation email
    const customerSubject = `Potvrzení přijetí poptávky - J. Pufr úklidové služby`;
    const customerText = isDetailed ? `
Dobrý den,
děkujeme za Váš zájem o služby J. Pufr úklidové služby. Vaši poptávku jsme úspěšně přijali a budeme Vás kontaktovat do 24 hodin.

Rekapitulace poptávky:
- Typ úklidu: ${serviceName}
- Rozloha nemovitosti: ${area} m²
- Adresa realizace: ${address || "Neuvedeno"}
- Orientační rozsah ceny: ${estimatedPriceMin} Kč - ${estimatedPriceMax} Kč

S pozdravem,
J. Pufr úklidové služby
+420 720 021 186 | josefpufr@email.cz
    ` : `
Dobrý den,
děkujeme za Vaši zprávu / poptávku. Úspěšně jsme ji přijali a budeme Vás kontaktovat do 24 hodin.

S pozdravem,
J. Pufr úklidové služby
+420 720 021 186 | josefpufr@email.cz
    `;

    const customerHtml = `
      <div style="font-family: sans-serif; max-width: 600px; margin: 0 auto; padding: 20px; border: 1px solid #e2e8f0; border-radius: 4px; color: #1e293b;">
        <h2 style="color: #2563eb; border-bottom: 2px solid #e2e8f0; padding-bottom: 10px; margin-top: 0;">Potvrzení přijetí poptávky</h2>
        <p>Vážený zákazníku,</p>
        <p>děkujeme za Váš zájem o služby <strong>J. Pufr úklidové služby</strong>. Vaši poptávku jsme úspěšně přijali a naši pracovníci Vás budou kontaktovat do 24 hodin za účelem upřesnění podrobností a vypracování závazné cenové nabídky.</p>
        
        ${isDetailed ? `
          <h3 style="color: #1e293b; border-bottom: 1px solid #e2e8f0; padding-bottom: 5px; margin-top: 25px;">Rekapitulace poptávky</h3>
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
              <td style="padding: 8px 0; font-weight: bold; vertical-align: top;">Doplňkové služby:</td>
              <td style="padding: 8px 0; margin: 0;"><ul style="margin: 0; padding-left: 20px;">${extrasList}</ul></td>
            </tr>
            <tr>
              <td style="padding: 8px 0; font-weight: bold;">Adresa realizace:</td>
              <td style="padding: 8px 0;">${address || "Neuvedeno"}</td>
            </tr>
            <tr style="background-color: #f8fafc;">
              <td style="padding: 12px 8px; font-weight: bold; color: #1e3a8a;">Orientační cena:</td>
              <td style="padding: 12px 8px; font-weight: bold; color: #1e3a8a; font-size: 16px;">
                ${estimatedPriceMin.toLocaleString("cs-CZ")} Kč - ${estimatedPriceMax.toLocaleString("cs-CZ")} Kč
              </td>
            </tr>
          </table>
        ` : `
          <h3 style="color: #1e293b; border-bottom: 1px solid #e2e8f0; padding-bottom: 5px; margin-top: 25px;">Vaše odeslaná zpráva</h3>
          <p style="white-space: pre-wrap; background-color: #f8fafc; padding: 12px; border-radius: 4px; border: 1px solid #e2e8f0; font-style: italic; color: #475569;">
            ${message || "Bez doprovodné zprávy."}
          </p>
        `}

        <div style="margin-top: 30px; padding-top: 20px; border-top: 1px solid #e2e8f0; font-size: 13px; color: #475569;">
          <strong>J. Pufr úklidové služby</strong><br />
          Telefon: +420 720 021 186<br />
          E-mail: josefpufr@email.cz<br />
          Sídlo: 391 55 Chýnov
        </div>
      </div>
    `;

    const customerMailOptions = {
      from: `"J. Pufr úklidové služby" <${fromAddress}>`,
      to: email,
      // Zákazník odpovídá na provozní e-mail, ne na odesílací Gmail.
      replyTo: ownerAddress,
      subject: customerSubject,
      text: customerText,
      html: customerHtml,
    };

    const customerInfo = await transporter.sendMail(customerMailOptions);
    
    if (!smtpHost) {
      console.log("✉️ Ethereal Client Mail odeslán. ID:", clientInfo.messageId);
      console.log("✉️ Ethereal Customer Mail odeslán. ID:", customerInfo.messageId);
      console.log("✉️ Ethereal Client Preview:", nodemailer.getTestMessageUrl(clientInfo));
      console.log("✉️ Ethereal Customer Preview:", nodemailer.getTestMessageUrl(customerInfo));
      return NextResponse.json({
        success: true,
        message: "Poptávky byly zpracovány (Ethereal test).",
        previewUrl: nodemailer.getTestMessageUrl(clientInfo),
        customerPreviewUrl: nodemailer.getTestMessageUrl(customerInfo)
      });
    }

    return NextResponse.json({
      success: true,
      message: "Poptávka byla úspěšně odeslána na e-mail."
    });

  } catch (error) {
    console.error("Error sending email:", error);
    return NextResponse.json(
      { error: "Nepodařilo se odeslat e-mail. Zkuste to prosím znovu nebo nás kontaktujte telefonicky." },
      { status: 500 }
    );
  }
}
