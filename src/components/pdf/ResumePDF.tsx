import { Document, Page, Text, View, StyleSheet } from '@react-pdf/renderer';

const styles = StyleSheet.create({
  page: {
    padding: 40,
    fontFamily: 'Helvetica',
    fontSize: 11,
    color: '#333',
    lineHeight: 1.5,
  },
  header: {
    marginBottom: 20,
    borderBottomWidth: 2,
    borderBottomColor: '#2563eb',
    paddingBottom: 10,
  },
  name: {
    fontSize: 28,
    fontWeight: 'bold',
    color: '#1e40af',
    marginBottom: 4,
  },
  title: {
    fontSize: 14,
    color: '#475569',
    marginBottom: 10,
    textTransform: 'uppercase',
    letterSpacing: 1,
  },
  contactRow: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 15,
    fontSize: 10,
    color: '#64748b',
  },
  section: {
    marginBottom: 15,
  },
  sectionTitle: {
    fontSize: 14,
    fontWeight: 'bold',
    color: '#1e40af',
    borderBottomWidth: 1,
    borderBottomColor: '#e2e8f0',
    paddingBottom: 4,
    marginBottom: 10,
    marginTop: 10,
    textTransform: 'uppercase',
  },
  paragraph: {
    marginBottom: 8,
    textAlign: 'justify',
  },
  experienceItem: {
    marginBottom: 14,
  },
  expHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 4,
  },
  expRole: {
    fontWeight: 'bold',
    fontSize: 12,
    color: '#1e293b',
  },
  expCompany: {
    color: '#3b82f6',
  },
  expDate: {
    fontSize: 10,
    color: '#64748b',
  },
  expDetail: {
    marginBottom: 3,
    fontSize: 10,
  },
  skillsCategory: {
    marginBottom: 8,
  },
  skillsCatTitle: {
    fontWeight: 'bold',
    color: '#334155',
    marginBottom: 2,
  },
  skillsList: {
    fontSize: 10,
    color: '#475569',
  },
  projectItem: {
    marginBottom: 10,
  },
  projectTitle: {
    fontWeight: 'bold',
    color: '#1e293b',
  },
  projectDesc: {
    fontSize: 10,
    color: '#475569',
    marginTop: 2,
  }
});

// Tipagem básica para facilitar
export const ResumePDF = ({ data }: { data: any }) => (
  <Document>
    <Page size="A4" style={styles.page}>
      
      {/* Header */}
      <View style={styles.header}>
        <Text style={styles.name}>{data.hero.name || 'André Ricardo'}</Text>
        <Text style={styles.title}>{data.hero.upperSub}</Text>
        <View style={styles.contactRow}>
          {data.about.facts.map((fact: any) => (
            <Text key={fact.label}>{fact.label}: {fact.value.replace('https://', '')}</Text>
          ))}
          {data.footer.links.linkedin && (
            <Text>LinkedIn: {data.footer.links.linkedin.replace('https://www.', '')}</Text>
          )}
        </View>
      </View>

      {/* Resumo Profissional */}
      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Resumo Profissional</Text>
        {data.about.paragraphs.map((p: string, i: number) => (
          <Text key={i} style={styles.paragraph}>{p}</Text>
        ))}
      </View>

      {/* Experiência Profissional (Limitar às mais relevantes para caber) */}
      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Experiência Profissional</Text>
        {data.experience.items.slice(0, 5).map((exp: any) => (
          <View key={exp.id} style={styles.experienceItem}>
            <View style={styles.expHeader}>
              <Text style={styles.expRole}>{exp.role} na <Text style={styles.expCompany}>{exp.company}</Text></Text>
              <Text style={styles.expDate}>{exp.period}</Text>
            </View>
            {exp.details.map((detail: string, i: number) => (
              <Text key={i} style={styles.expDetail}>• {detail}</Text>
            ))}
            {exp.tecnologias && (
              <Text style={{...styles.expDetail, color: '#64748b', marginTop: 2, fontStyle: 'italic'}}>
                Ferramentas: {exp.tecnologias}
              </Text>
            )}
          </View>
        ))}
      </View>

      {/* Habilidades Principais */}
      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Conhecimentos Técnicos</Text>
        {data.skills.categories.map((cat: any) => (
          <View key={cat.id} style={styles.skillsCategory}>
            <Text style={styles.skillsCatTitle}>{cat.title}:</Text>
            <Text style={styles.skillsList}>{cat.tags.join(', ')}</Text>
          </View>
        ))}
      </View>

    </Page>
  </Document>
);
