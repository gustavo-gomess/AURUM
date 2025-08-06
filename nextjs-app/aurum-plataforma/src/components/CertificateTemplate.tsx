
import React from 'react';

interface CertificateProps {
  userName: string;
  courseTitle: string;
  completionDate: string;
}

const CertificateTemplate: React.FC<CertificateProps> = ({ userName, courseTitle, completionDate }) => {
  return (
    <div style={{
      width: '800px',
      height: '600px',
      border: '10px solid #FFD700',
      padding: '20px',
      textAlign: 'center',
      fontFamily: 'Arial, sans-serif',
      backgroundColor: '#f0f0f0',
      position: 'relative',
      boxSizing: 'border-box',
      display: 'flex',
      flexDirection: 'column',
      justifyContent: 'center',
      alignItems: 'center'
    }}>
      <h1 style={{ color: '#FFD700', fontSize: '48px', marginBottom: '20px' }}>Certificado de Conclusão</h1>
      <p style={{ fontSize: '24px', marginBottom: '10px' }}>Este certificado é concedido a</p>
      <h2 style={{ color: '#333', fontSize: '36px', marginBottom: '20px' }}>{userName}</h2>
      <p style={{ fontSize: '24px', marginBottom: '10px' }}>pela conclusão bem-sucedida do curso</p>
      <h3 style={{ color: '#333', fontSize: '30px', marginBottom: '30px' }}>{courseTitle}</h3>
      <p style={{ fontSize: '20px' }}>Concluído em: {completionDate}</p>
      <div style={{ position: 'absolute', bottom: '30px', right: '30px', fontSize: '18px', color: '#555' }}>
        AURUM Plataforma de Ensino
      </div>
    </div>
  );
};

export default CertificateTemplate;


