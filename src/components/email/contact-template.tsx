import { Html, Body, Head, Heading, Text, Container, Section } from '@react-email/components';
import * as React from 'react';

interface EmailTemplateProps {
  name: string;
  email: string;
  message: string;
}

export const ContactEmailTemplate = ({ name, email, message }: EmailTemplateProps) => (
  <Html>
    <Head />
    <Body style={{ fontFamily: 'sans-serif', backgroundColor: '#f4f4f4', padding: '20px' }}>
      <Container style={{ backgroundColor: '#ffffff', padding: '30px', borderRadius: '8px' }}>
        <Heading style={{ color: '#333' }}>New Portfolio Inquiry</Heading>
        <Text style={{ fontSize: '16px', color: '#555' }}>
          <strong>Name:</strong> {name}<br />
          <strong>Email:</strong> {email}
        </Text>
        <Section style={{ borderTop: '1px solid #eee', marginTop: '20px', paddingTop: '20px' }}>
          <Text style={{ fontSize: '16px', color: '#333' }}>{message}</Text>
        </Section>
      </Container>
    </Body>
  </Html>
);
