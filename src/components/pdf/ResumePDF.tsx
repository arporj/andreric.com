import { Document, Page, Text, View, StyleSheet, Image } from '@react-pdf/renderer';

const P = {
  colors: {
    surface: '#ffffff',
    surface_container_low: '#f2f4f6',
    primary: '#004ac6',
    primary_container: '#2563eb',
    on_surface: '#191c1e',
    on_surface_variant: '#434655',
    secondary_container: '#d5e3fc',
    on_secondary_container: '#57657a',
    outline_variant: '#c3c6d7'
  }
};

const styles = StyleSheet.create({
  page: {
    flexDirection: 'row',
    backgroundColor: P.colors.surface,
    fontFamily: 'Helvetica',
    fontSize: 10,
    color: P.colors.on_surface,
  },
  sidebar: {
    width: '32%',
    backgroundColor: P.colors.surface_container_low,
    padding: 30,
    paddingRight: 20,
    display: 'flex',
    flexDirection: 'column',
  },
  main: {
    width: '68%',
    padding: 40,
    paddingLeft: 30,
    display: 'flex',
    flexDirection: 'column',
  },
  photoContainer: {
    marginBottom: 30,
    alignItems: 'center',
  },
  photo: {
    width: 110,
    height: 110,
    borderRadius: 55,
    objectFit: 'cover',
  },
  sidebarSection: {
    marginBottom: 24,
  },
  sidebarTitle: {
    fontSize: 12,
    color: P.colors.on_surface,
    marginBottom: 10,
    textTransform: 'uppercase',
    letterSpacing: 1,
  },
  contactItem: {
    marginBottom: 10,
    flexDirection: 'column',
  },
  contactLabel: {
    fontSize: 8,
    color: P.colors.on_surface_variant,
    textTransform: 'uppercase',
    marginBottom: 2,
  },
  contactValue: {
    fontSize: 9,
    color: P.colors.on_surface,
    textDecoration: 'none',
  },
  skillCategory: {
    marginBottom: 12,
  },
  skillCatTitle: {
    fontSize: 10,
    color: P.colors.on_surface,
    marginBottom: 6,
  },
  skillsWrap: {
    flexDirection: 'row',
    flexWrap: 'wrap',
  },
  skillChip: {
    backgroundColor: P.colors.surface,
    paddingVertical: 4,
    paddingHorizontal: 8,
    borderRadius: 12,
    fontSize: 8,
    color: P.colors.on_surface_variant,
    marginRight: 4,
    marginBottom: 4,
  },
  header: {
    marginBottom: 30,
  },
  name: {
    fontSize: 34,
    color: P.colors.on_surface,
    marginBottom: 6,
    letterSpacing: -0.5,
    lineHeight: 1.1,
  },
  title: {
    fontSize: 13,
    color: P.colors.primary,
    textTransform: 'uppercase',
    letterSpacing: 2,
  },
  sectionTitle: {
    fontSize: 16,
    color: P.colors.on_surface,
    marginBottom: 12,
    marginTop: 10,
    letterSpacing: -0.2,
  },
  paragraph: {
    fontSize: 10,
    lineHeight: 1.6,
    color: P.colors.on_surface_variant,
    marginBottom: 10,
    textAlign: 'justify',
  },
  experienceItem: {
    marginBottom: 20,
  },
  expHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'baseline',
    marginBottom: 6,
  },
  expRoleWrapper: {
    flex: 1,
    paddingRight: 10,
  },
  expRole: {
    fontSize: 12,
    color: P.colors.on_surface,
    marginBottom: 2,
  },
  expCompany: {
    color: P.colors.primary,
  },
  expDate: {
    fontSize: 9,
    color: P.colors.on_surface_variant,
    textTransform: 'uppercase',
  },
  expTech: {
    fontSize: 9,
    color: P.colors.primary,
    marginTop: 6,
  }
});

// Tipagem básica para facilitar
export const ResumePDF = ({ data }: { data: any }) => (
  <Document>
    <Page size="A4" style={styles.page}>
      
      {/* Coluna da Esquerda (Sidebar) */}
      <View style={styles.sidebar}>
        
        {/* Foto desabilitada para debug
        {data.hero.imageSrc && (
          <View style={styles.photoContainer}>
            <Image src={data.hero.imageSrc} style={styles.photo} />
          </View>
        )}
        */}

        <View style={styles.sidebarSection}>
          <Text style={styles.sidebarTitle}>Contato</Text>
          {data.about.facts.map((fact: any) => (
            <View key={fact.label} style={styles.contactItem}>
              <Text style={styles.contactLabel}>{fact.label}</Text>
              <Text style={styles.contactValue}>{fact.value}</Text>
            </View>
          ))}
          {data.footer?.links?.linkedin && (
            <View style={styles.contactItem}>
              <Text style={styles.contactLabel}>LinkedIn</Text>
              <Text style={styles.contactValue}>
                {data.footer.links.linkedin.replace('https://www.linkedin.com/in/', '')}
              </Text>
            </View>
          )}
          {data.footer?.links?.github && (
            <View style={styles.contactItem}>
              <Text style={styles.contactLabel}>GitHub</Text>
              <Text style={styles.contactValue}>
                {data.footer.links.github.replace('https://github.com/', '')}
              </Text>
            </View>
          )}
        </View>

        <View style={styles.sidebarSection}>
          <Text style={styles.sidebarTitle}>Hard Skills</Text>
          {data.skills.categories.map((cat: any) => (
            <View key={cat.id} style={styles.skillCategory}>
              <Text style={styles.skillCatTitle}>{cat.title}</Text>
              <View style={styles.skillsWrap}>
                {cat.tags.map((tag: string, index: number) => (
                  <Text key={index} style={styles.skillChip}>{tag}</Text>
                ))}
              </View>
            </View>
          ))}
        </View>

      </View>

      {/* Coluna da Direita (Body) */}
      <View style={styles.main}>
        
        <View style={styles.header}>
          <Text style={styles.name}>{data.hero.name || 'André Ricardo'}</Text>
          <Text style={styles.title}>{data.hero.upperSub}</Text>
        </View>

        <View style={{ marginBottom: 24 }}>
          <Text style={styles.sectionTitle}>Resumo Profissional</Text>
          {data.about.paragraphs.map((p: string, i: number) => (
            <Text key={i} style={styles.paragraph}>{p}</Text>
          ))}
        </View>

        <View>
          <Text style={styles.sectionTitle}>Experiência Profissional</Text>
          {data.experience.items.slice(0, 4).map((exp: any) => (
            <View key={exp.id} style={styles.experienceItem}>
              <View style={styles.expHeader}>
                <View style={styles.expRoleWrapper}>
                  <Text style={styles.expRole}>{exp.role}</Text>
                  <Text style={styles.expCompany}>{exp.company}</Text>
                </View>
                <Text style={styles.expDate}>{exp.period}</Text>
              </View>
              {exp.details.map((detail: string, i: number) => (
                <View key={i} style={{ flexDirection: 'row', marginBottom: 4 }}>
                  <Text style={{ fontSize: 10, color: P.colors.on_surface_variant, width: 10 }}>•</Text>
                  <Text style={{ fontSize: 10, color: P.colors.on_surface_variant, lineHeight: 1.4, flex: 1 }}>{detail}</Text>
                </View>
              ))}
              {exp.tecnologias && (
                <Text style={styles.expTech}>Stacks: {exp.tecnologias}</Text>
              )}
            </View>
          ))}
        </View>

      </View>

    </Page>
  </Document>
);

