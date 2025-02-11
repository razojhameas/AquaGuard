// styles.js
import { StyleSheet } from "react-native";

const styles = StyleSheet.create({
  startingPage: { flex: 1, justifyContent: "center", alignItems: "center" },
  appName: {
    fontSize: 40,
    color: "#3a3fbd",
    fontWeight: "bold",
    fontFamily: "notoserif",
    textShadowRadius: 2,
    textShadowColor: "navy",
    letterSpacing: 0.1,
  },
  appDescription: {
    fontSize: 20,
    marginTop: 10,
    marginBottom: 70,
    textDecorationLine: "line",
    textDecorationColor: "line",
    textDecorationStyle: "solid",
  },
  languageSelection: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
  homePage: { flex: 1, justifyContent: "center", alignItems: "center" },
  waterQualityPage: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
  emptyPage: { flex: 1, justifyContent: "center", alignItems: "center" },
  label: { fontSize: 16, marginTop: 10 },
  value: { fontSize: 16, fontWeight: "bold", marginTop: 5 },
  homePage: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
  button: {
    backgroundColor: "#3a3fbd",
    padding: 12,
    borderRadius: 10,
    width: 250,
  },
  buttonText: {
    color: "white",
    fontSize: 20,
    textAlign: "center",
    fontWeight: "bold",
  },
  mybuttonText: {
    color: "black",
    fontSize: 12,
    textAlign: "center",
  },
  button1: {
    backgroundColor: "#3a3fbd",
    padding: 10,
    borderRadius: 5,
    width: 250,
    marginTop: 10,
    marginButtom: 10,
  },
  button2: {
    backgroundColor: "#497838",
    padding: 10,
    borderRadius: 5,
    width: 250,
    marginTop: 10,
    marginButtom: 10,
  },
  button3: {
    backgroundColor: "#b03749",
    padding: 10,
    borderRadius: 5,
    width: 250,
    marginTop: 10,
    marginButtom: 10,
  },
  button4: {
    backgroundColor: "#497838",
    padding: 15,
    borderRadius: 10,
    width: 250,
  },
  alterButton: {
    backgroundColor: "#ddd",
    padding: 12,
    borderRadius: 10,
    width: 250,
    borderWidth: 3,
    borderColor: "#3a3fbd",
  },
  alterbuttonText: {
    color: "#3a3fbd",
    fontSize: 20,
    textAlign: "center",
    fontWeight: "bold",
  },
  buttonText1: {
    color: "white",
    fontSize: 18,
    textAlign: "center",
  },
  confirmButton: {
    backgroundColor: "#F2F2F2",
    padding: 10,
    borderRadius: 5,
    width: 200,
    marginTop: 20,
  },
  confirmButtonText: { color: "white", fontSize: 32, textAlign: "center" },

  tableContainer: {
    width: "100%",
    borderWidth: 1,
    borderColor: "#ccc",
    borderRadius: 5,
    padding: 10,
  },
  tableRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    borderBottomWidth: 1,
    borderBottomColor: "#ccc",
    paddingVertical: 10,
  },
  automatedFeedingPage: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
  tableHeader: {
    width: "40%",
    fontWeight: "italic",
    paddingHorizontal: 10, // add some horizontal padding
  },
  tableCell: {
    width: "30%",
    paddingHorizontal: 10, // add some horizontal padding
  },
  viewDetailsButton: {
    backgroundColor: "#3a3fbd",
    padding: 10,
    borderRadius: 5,
  },
  viewDetailsButtonText: {
    color: "white",
    fontSize: 16,
    textAlign: "center",
  },
  heading: {
    fontSize: 20,
    fontWeight: "bold",
    marginBottom: 40,
    textAlign: "center",
    color: "black",
  },
  pageTitle: {
    fontSize: 24,
    fontWeight: "bold",
    marginBottom: 30,
    textAlign: "center",
    marginTop: 30,
    color: "black",
  },
  button0: {
    backgroundColor: "#3a3fbd",
    padding: 10,
    borderRadius: 10,
    width: 200,
    marginButtom: 10,
    marginTop: 10,
  },
  buttonText0: {
    color: "white",
    fontSize: 16,
    textAlign: "center",
  },
  table0: {
    borderWidth: 1,
    borderColor: "#3a3fbd",
    padding: 20,
    paddingBottom: 10,
  },
  tableRow0: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginBottom: 10,
  },
  tableHeader0: {
    fontSize: 18,
    fontWeight: "bold",
  },
  tableData0: {
    fontSize: 18,
    marginTop: 10,
    marginLeft: 10,
  },
  tableContainer1: {
    justifyContent: "center",
    alignItems: "center",
  },
  buttonContainer1: {
    flexDirection: "column",
    justifyContent: "space-between",
    marginBottom: 10,
  },
  inputContainer: {
    justifyContent: "center",
    alignItems: "center",
  },
});

export default styles;
