import './globals.css';

export const metadata = {
  title: 'Formação Vibe Coding',
  description: 'Plataforma construída em formação Kaizen com sessões rotativas.',
};

export default function RootLayout({ children }) {
  return (
    <html lang="pt">
      <body>{children}</body>
    </html>
  );
}
