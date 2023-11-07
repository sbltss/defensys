import {
  Document,
  // Image,
  Page,
  StyleSheet,
  Text,
  View,
} from "@react-pdf/renderer";

const PDFDocument = () => {
  return (
    <Document>
      <Page size="A4" style={styles.page}>
        <View style={styles.header}>
          <Text>asdasdasdasd</Text>
        </View>
      </Page>
    </Document>
  );
};

const styles = StyleSheet.create({
  page: {
    backgroundColor: "#fff",
    color: "black",
    marginVertical: 20,
  },

  header: {
    flexDirection: "row",
    alignItems: "center",
    paddingHorizontal: 20,
    paddingBottom: 10,
    borderBottom: "1 solid #555",
  },
});

export default PDFDocument;
