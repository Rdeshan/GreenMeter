import { StyleSheet } from "react-native";

export default StyleSheet.create({
  container: { 
    flex: 1, 
    backgroundColor: "#F0F9F4" 
  },
  header: {
    paddingHorizontal: 20,
    paddingTop: 10,
    paddingBottom: 20,
    alignItems: 'center',
  },
  title: {
    fontSize: 32,
    fontWeight: "800",
    color: "#16a34a",
    textAlign: "center",
  },
  subtitle: {
    fontSize: 16,
    color: "#6B7280",
    marginTop: 4,
    textAlign: "center",
  },
  overviewCard: {
    backgroundColor: "#FFFFFF",
    marginHorizontal: 20,
    borderRadius: 16,
    padding: 20,
    marginBottom: 5,
    shadowColor: "#16a34a",
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.1,
    shadowRadius: 12,
    elevation: 8,
  },
  overviewRow: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    alignItems: 'center',
  },
  overviewItem: {
    alignItems: 'center',
    flex: 1,
  },
  overviewNumber: {
    fontSize: 24,
    fontWeight: '800',
    color: '#16a34a',
  },
  currentUsageNumber:{
      fontSize: 24,
    fontWeight: '800',
    color: '#be1531ff',
  },
  overviewLabel: {
    fontSize: 12,
    color: '#6B7280',
    marginTop: 4,
    textAlign: 'center',
  },
  overviewDivider: {
    width: 1,
    height: 40,
    backgroundColor: '#E5E7EB',
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  
  },
  loadingText: {
    marginTop: 12,
    color: '#6B7280',
    fontSize: 16,
  },
  listContainer: { 
    padding: 20, 
    paddingBottom: 100, 
    

  },
  deviceCard: {
    backgroundColor: "#FFFFFF",
    borderRadius: 16,
    padding: 20,
    marginBottom: 16,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 6 },
    shadowOpacity: 0.1,
    shadowRadius: 12,
    elevation: 6,
    borderWidth: 2,
    borderColor: 'transparent',

  },
  deviceCardOff: {
    backgroundColor: "#F9FAFB",
    opacity: 0.8,
  },
  cardHeader: { 
    flexDirection: "row", 
    alignItems: "center",
    marginBottom: 16,
  },
  deviceIcon: {
    width: 48,
    height: 48,
    borderRadius: 24,
    backgroundColor: '#F0F9F4',
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 12,
  },
  iconText: { 
    fontSize: 24 
  },
  deviceInfo: { 
    flex: 1 
  },
  deviceName: { 
    fontSize: 18, 
    fontWeight: "700",
    color: "#1F2937",
  },
  deviceLocation: { 
    fontSize: 14, 
    color: "#6B7280",
    marginTop: 2,
  },
  cardActions: { 
    flexDirection: "row", 
    alignItems: "center", 
    gap: 8 
  },
  actionBtn: { 
    padding: 8,
    marginLeft: 4,
  },
  editText: {
    fontSize: 16,
  },
  deleteText: {
    fontSize: 16,
  },
  toggleContainer: {
    padding: 4,
  },
  toggleDisabled: {
    opacity: 0.5,
  },
  toggleTrack: {
    width: 44,
    height: 24,
    borderRadius: 12,
    justifyContent: 'center',
  },
  toggleThumb: {
    width: 20,
    height: 20,
    borderRadius: 10,
    backgroundColor: '#FFFFFF',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.2,
    shadowRadius: 2,
    elevation: 3,
  },
  energyStats: {
    borderTopWidth: 1,
    borderTopColor: '#F3F4F6',
    paddingTop: 16,
  },
  energyIndicator: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 12,
  },
  energyDot: {
    width: 8,
    height: 8,
    borderRadius: 4,
    marginRight: 8,
  },
  energyText: {
    fontSize: 14,
    fontWeight: '600',
  },
  statsRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    
  },
  statItem: {
    alignItems: 'center',
    flex: 1,
  
  },
  statLabel: {
    fontSize: 10,
    color: '#9CA3AF',
    textTransform: 'uppercase',
    fontWeight: '600',
  },
  statValue: {
    fontSize: 14,
    color: '#374151',
    fontWeight: '600',
    marginTop: 2,
  },
  activeIndicator: {
    position: 'absolute',
    top: 12,
    right: 12,
  },
  activeText: {
    fontSize: 10,
    color: '#16a34a',
    fontWeight: '700',
  },
  emptyContainer: {
    alignItems: 'center',
    marginTop: 60,
    paddingHorizontal: 20,
  },
  emptyIcon: {
    fontSize: 48,
    marginBottom: 16,
  },
  emptyTitle: {
    fontSize: 18,
    fontWeight: '700',
    color: '#1F2937',
    marginBottom: 8,
  },
  emptySubtitle: {
    fontSize: 14,
    color: '#6B7280',
    textAlign: 'center',
  },
  
  modalContainer: { 
    flex: 1, 
    padding: 20, 
    backgroundColor: "#F0F9F4" 
  },
  modalTitle: { 
    fontSize: 24, 
    fontWeight: "700", 
    marginBottom: 24,
    color: "#16a34a",
    textAlign: 'center',
  },
  input: {
    backgroundColor: "#FFFFFF",
    paddingHorizontal: 16,
    paddingVertical: 12,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: "#E5E7EB",
    marginBottom: 16,
    fontSize: 16,
  },
  modalActions: {
    flexDirection: "row",
    marginTop: 24,
    gap: 12,
  },
  modalBtn: {
    flex: 1,
    paddingVertical: 14,
    paddingHorizontal: 16,
    borderRadius: 12,
    alignItems: "center",
  },
  cancelBtn: {
    backgroundColor: "#F3F4F6",
    borderWidth: 1,
    borderColor: "#E5E7EB",
  },
  saveBtn: {
    backgroundColor: "#16a34a",
  },
  cancelBtnText: {
    color: "#6B7280",
    fontSize: 16,
    fontWeight: "600",
  },
  saveBtnText: {
    color: "#FFFFFF",
    fontSize: 16,
    fontWeight: "700",
  },


  fabContainer: {
    position: 'absolute',
    bottom: 110,
    right: 30,
  },
  tagWrapper: {
    flexDirection: 'row', // Button + tag side-by-side
    alignItems: 'center',
  },
  fab: {
    backgroundColor: '#007AFF',
    width: 60,
    height: 60,
    borderRadius: 30,
    justifyContent: 'center',
    alignItems: 'center',
    elevation: 5,
    shadowColor: '#000',
    shadowOpacity: 0.3,
    shadowOffset: { width: 0, height: 3 },
    shadowRadius: 3,
  },
  fabText: {
    fontSize: 30,
    color: '#fff',
  },
  tag: {
    backgroundColor: '#007AFF',
    paddingHorizontal: 12,
    paddingVertical: 8,
    borderTopRightRadius: 30,
    borderBottomRightRadius: 30,
    marginBottom:-10
  },
  tagText: {
    color: '#fff',
    fontSize: 13,
    fontWeight: '600',
  },
});