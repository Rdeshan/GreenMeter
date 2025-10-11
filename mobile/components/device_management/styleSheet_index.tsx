// components/device_management/All_Styles.js
import { StyleSheet, Dimensions } from "react-native";
const { width } = Dimensions.get("window");

export default StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#f0fdf4",
    paddingHorizontal: 10,
  },

  header: {
    alignItems: "center",
    marginTop: 10,
    marginBottom: 12,
  },
  title: {
    fontSize: 26,
    fontWeight: "700",
    color: "#15803d",
  },
  subtitle: {
    fontSize: 14,
    color: "#4ade80",
  },

  overviewCard: {
    backgroundColor: "#dcfce7",
    borderRadius: 15,
    padding: 16,
    marginHorizontal: 6,
    marginBottom: 10,
  },
  overviewRow: {
    flexDirection: "row",
    justifyContent: "space-around",
    alignItems: "center",
  },
  overviewItem: {
    alignItems: "center",
    flex: 1,
  },
  overviewDivider: {
    width: 1,
    height: 40,
    backgroundColor: "#86efac",
  },
  overviewNumber: {
    fontSize: 20,
    fontWeight: "600",
    color: "#15803d",
  },
  overviewLabel: {
    fontSize: 12,
    color: "#166534",
  },
  currentUsageNumber: {
    fontSize: 18,
    fontWeight: "700",
    color: "#16a34a",
  },

  listContainer: {
    paddingBottom: 100,
  },
  columnWrapper: {
    justifyContent: "space-between",
    paddingHorizontal: 8,
  },

  deviceCard: {
    backgroundColor: "#fff",
    borderRadius: 16,
    padding: 12,
    marginVertical: 8,
    width: width / 2 - 20, // 👈 ensures 2 cards per row with spacing
    shadowColor: "#000",
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  deviceCardOff: {
    backgroundColor: "#f9fafb",
    opacity: 0.8,
  },
  cardHeader: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
  },
  deviceIcon: {
    backgroundColor: "#dcfce7",
    borderRadius: 12,
    padding: 10,
  },
  iconText: {
    fontSize: 26,
  },
  deviceInfo: {
    flex: 1,
    marginLeft: 8,
  },
  deviceName: {
    fontSize: 16,
    fontWeight: "600",
    color: "#14532d",
  },
  deviceLocation: {
    fontSize: 12,
    color: "#4b5563",
  },
  cardActions: {
    alignItems: "center",
  },
  energyStats: {
    marginTop: 8,
  },
  statsRow: {
    flexDirection: "row",
    justifyContent: "space-between",
  },
  statItem: {
    alignItems: "center",
  },
  statLabel: {
    fontSize: 12,
    color: "#6b7280",
  },
  statValue: {
    fontSize: 13,
    fontWeight: "600",
    color: "#15803d",
  },
  activeIndicator: {
    marginTop: 5,
    alignSelf: "flex-end",
  },
  activeText: {
    color: "#16a34a",
    fontSize: 12,
    fontWeight: "700",
  },

  loadingContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
  loadingText: {
    marginTop: 10,
    color: "#166534",
  },
  emptyContainer: {
    alignItems: "center",
    marginTop: 100,
  },
  emptyIcon: {
    fontSize: 50,
  },
  emptyTitle: {
    fontSize: 18,
    fontWeight: "700",
    color: "#15803d",
    marginTop: 10,
  },
  emptySubtitle: {
    fontSize: 13,
    color: "#4b5563",
  },
});
