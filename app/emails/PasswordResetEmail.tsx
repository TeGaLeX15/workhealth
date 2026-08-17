// app/emails/PasswordResetEmail.tsx
import {
  Body,
  Button,
  Container,
  Head,
  Heading,
  Html,
  Link,
  Preview,
  Section,
  Text,
} from "@react-email/components";

type PasswordResetEmailProps = {
  resetUrl: string;
};

export default function PasswordResetEmail({
  resetUrl,
}: PasswordResetEmailProps) {
  return (
    <Html>
      <Head />

      <Preview>Восстановление пароля в Body OS</Preview>

      <Body style={styles.body}>
        <Container style={styles.container}>
          {/* Brand */}
          <Section style={styles.brandSection}>
            <Text style={styles.brand}>BODY OS</Text>
          </Section>

          {/* Main content */}
          <Section style={styles.card}>
            <Heading style={styles.heading}>Восстановление пароля</Heading>

            <Text style={styles.text}>
              Мы получили запрос на восстановление пароля для вашего аккаунта
              Body OS.
            </Text>

            <Text style={styles.text}>
              Нажмите кнопку ниже, чтобы установить новый пароль.
            </Text>

            {/* CTA */}
            <Section style={styles.buttonSection}>
              <Button href={resetUrl} style={styles.button}>
                Изменить пароль
              </Button>
            </Section>

            {/* Expiration */}
            <Text style={styles.mutedText}>
              Ссылка действует ограниченное время и может быть использована
              только один раз.
            </Text>

            {/* Fallback URL */}
            <Text style={styles.fallbackLabel}>
              Если кнопка не работает, откройте ссылку:
            </Text>

            <Link href={resetUrl} style={styles.link}>
              {resetUrl}
            </Link>
          </Section>

          {/* Security notice */}
          <Section style={styles.notice}>
            <Text style={styles.noticeTitle}>
              Не запрашивали восстановление?
            </Text>

            <Text style={styles.noticeText}>
              Если вы не запрашивали смену пароля, просто проигнорируйте это
              письмо. Ваш аккаунт останется в безопасности.
            </Text>
          </Section>

          {/* Footer */}
          <Section style={styles.footer}>
            <Text style={styles.footerBrand}>BODY OS</Text>

            <Text style={styles.footerText}>
              Ваши тренировки. Ваш прогресс.
            </Text>

            <Text style={styles.footerCopyright}>
              Это автоматическое сообщение, отвечать на него не нужно.
            </Text>
          </Section>
        </Container>
      </Body>
    </Html>
  );
}

const styles = {
  body: {
    margin: 0,
    padding: "40px 16px",
    backgroundColor: "#f6f7f9",
    fontFamily:
      "-apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Helvetica, Arial, sans-serif",
    color: "#111827",
  },

  container: {
    width: "100%",
    maxWidth: "560px",
    margin: "0 auto",
  },

  brandSection: {
    textAlign: "center" as const,
    padding: "0 0 24px",
  },

  brand: {
    margin: 0,
    fontSize: "18px",
    lineHeight: "24px",
    fontWeight: "800",
    letterSpacing: "2px",
    color: "#111827",
  },

  card: {
    backgroundColor: "#ffffff",
    border: "1px solid #e5e7eb",
    borderRadius: "20px",
    padding: "40px 36px",
  },

  heading: {
    margin: "0 0 20px",
    fontSize: "28px",
    lineHeight: "34px",
    fontWeight: "700",
    letterSpacing: "-0.5px",
    color: "#111827",
  },

  text: {
    margin: "0 0 14px",
    fontSize: "16px",
    lineHeight: "25px",
    color: "#4b5563",
  },

  buttonSection: {
    padding: "18px 0 20px",
  },

  button: {
    display: "inline-block",
    padding: "14px 24px",
    borderRadius: "12px",
    backgroundColor: "#111827",
    color: "#ffffff",
    fontSize: "15px",
    lineHeight: "20px",
    fontWeight: "600",
    textDecoration: "none",
  },

  mutedText: {
    margin: "0 0 24px",
    fontSize: "13px",
    lineHeight: "20px",
    color: "#9ca3af",
  },

  fallbackLabel: {
    margin: "0 0 8px",
    fontSize: "13px",
    lineHeight: "20px",
    color: "#6b7280",
  },

  link: {
    display: "block",
    fontSize: "13px",
    lineHeight: "20px",
    color: "#4b5563",
    textDecoration: "underline",
    wordBreak: "break-all" as const,
  },

  notice: {
    padding: "24px 8px 0",
  },

  noticeTitle: {
    margin: "0 0 6px",
    fontSize: "14px",
    lineHeight: "20px",
    fontWeight: "600",
    color: "#374151",
  },

  noticeText: {
    margin: 0,
    fontSize: "13px",
    lineHeight: "20px",
    color: "#6b7280",
  },

  footer: {
    padding: "32px 8px 0",
    textAlign: "center" as const,
  },

  footerBrand: {
    margin: "0 0 4px",
    fontSize: "13px",
    lineHeight: "18px",
    fontWeight: "700",
    letterSpacing: "1.5px",
    color: "#9ca3af",
  },

  footerText: {
    margin: "0 0 12px",
    fontSize: "12px",
    lineHeight: "18px",
    color: "#9ca3af",
  },

  footerCopyright: {
    margin: 0,
    fontSize: "11px",
    lineHeight: "17px",
    color: "#b0b5bd",
  },
};
