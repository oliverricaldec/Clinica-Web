package com.clinica.api.modules.cita.service;

import jakarta.mail.MessagingException;
import jakarta.mail.internet.MimeMessage;
import org.springframework.mail.javamail.JavaMailSender;
import org.springframework.mail.javamail.MimeMessageHelper;
import org.springframework.stereotype.Service;

@Service
public class EmailService {

    private final JavaMailSender mailSender;

    public EmailService(JavaMailSender mailSender) {
        this.mailSender = mailSender;
    }

    public void enviarRecordatorioCita(String destinatario, String nombrePaciente, String fechaHora, String motivo, String doctor) {
        try {
            MimeMessage message = mailSender.createMimeMessage();
            MimeMessageHelper helper = new MimeMessageHelper(message, true, "UTF-8");

            helper.setTo(destinatario);
            helper.setSubject("⏰ Recordatorio de Cita Médica - Clínica");

            String htmlContent = """
                <div style="font-family: Arial, sans-serif; color: #333; max-width: 600px; margin: 0 auto; padding: 20px; border: 1px solid #e0e0e0; border-radius: 8px;">
                    <h2 style="color: #0497ff;">Hola, %s</h2>
                    <p>Le recordamos que tiene una cita médica programada:</p>
                    <ul style="line-height: 1.8;">
                        <li><strong>📅 Fecha y Hora:</strong> %s</li>
                        <li><strong>👨‍⚕️ Doctor:</strong> %s</li>
                        <li><strong>📝 Motivo:</strong> %s</li>
                    </ul>
                    <p>Por favor, confirme o notifique cualquier cambio con anticipación.</p>
                    <hr style="border: 0; border-top: 1px solid #eee;" />
                    <p style="font-size: 12px; color: #777;">Este es un mensaje automático, por favor no responder a este correo.</p>
                </div>
            """.formatted(nombrePaciente, fechaHora, doctor != null ? doctor : "Por asignar", motivo);

            helper.setText(htmlContent, true);
            mailSender.send(message);

        } catch (MessagingException e) {
            System.err.println("Error al enviar correo a " + destinatario + ": " + e.getMessage());
        }
    }
}