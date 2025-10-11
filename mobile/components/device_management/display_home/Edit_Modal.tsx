import React, { useState, useEffect } from "react";
import {
  View,
  Text,
  Modal,
  TextInput,
  TouchableOpacity,
  ActivityIndicator,
  SafeAreaView,
} from "react-native";
import styles from "../All_Styles";
import { DeviceItem } from "@/components/device_management/display_home/type/DeviceItem";

type EditDeviceModalProps = {
  visible: boolean;
  device: DeviceItem | null;
  onClose: () => void;
  onSave: (updated: DeviceItem) => void;
  saving: boolean;
};

export default function EditDeviceModal({
  visible,
  device,
  onClose,
  onSave,
  saving,
}: EditDeviceModalProps) {
  const [formData, setFormData] = useState({
    device_name: "",
    type: "",
    location: "",
    consumption: 0,
  });

  useEffect(() => {
    if (device) {
      setFormData({
        device_name: device.device_name || "",
        type: device.type || "",
        location: device.location || "",
        consumption: device.consumption || 0,
      });
    }
  }, [device]);

  const handleChange = (key: keyof DeviceItem, value: string | number) => {
    setFormData((prev) => ({ ...prev, [key]: value }));
  };

  const handleSave = () => {
    if (device) {
      onSave({ ...device, ...formData });
    }
  };

  return (
    
      <SafeAreaView style={styles.modalContainer}>
        <Text style={styles.modalTitle}>Edit Device</Text>

        <TextInput
          style={styles.input}
          value={formData.device_name}
          onChangeText={(t) => handleChange("device_name", t)}
          placeholder="Device name"
        />
        <TextInput
          style={styles.input}
          value={formData.type}
          onChangeText={(t) => handleChange("type", t)}
          placeholder="Type (e.g., Electric)"
        />
        <TextInput
          style={styles.input}
          value={formData.location}
          onChangeText={(t) => handleChange("location", t)}
          placeholder="Location"
        />
        <TextInput
          style={styles.input}
          value={String(formData.consumption)}
          onChangeText={(t) =>
            handleChange("consumption", t === "" ? 0 : Number(t) || 0)
          }
          placeholder="Consumption (Watts)"
          keyboardType="numeric"
        />

        <View style={styles.modalActions}>
          <TouchableOpacity
            style={[styles.modalBtn, styles.cancelBtn]}
            onPress={onClose}
          >
            <Text style={styles.cancelBtnText}>Cancel</Text>
          </TouchableOpacity>

          <TouchableOpacity
            style={[styles.modalBtn, styles.saveBtn]}
            onPress={handleSave}
            disabled={saving}
          >
            {saving ? <ActivityIndicator color="#fff" /> : <Text style={styles.saveBtnText}>Save Changes</Text>}
          </TouchableOpacity>
        </View>
      </SafeAreaView>
   
  );
}
