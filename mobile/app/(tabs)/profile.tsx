import React from 'react';
import { View, Text, Image, TouchableOpacity, ScrollView } from 'react-native';

const Profile = () => {
  const user = {
    name: 'Ravindu Perera',
    email: 'ravindu@example.com',
    avatar: 'https://i.pravatar.cc/150?img=12',
  };

  return (
    <ScrollView style={{ flex: 1, backgroundColor: '#F9FAFB', padding: 16 }}>
      <View style={{ alignItems: 'center', marginTop: 30 }}>
        <Image
          source={{ uri: user.avatar }}
          style={{ width: 100, height: 100, borderRadius: 50, marginBottom: 12 }}
        />
        <Text style={{ fontSize: 22, fontWeight: 'bold' }}>{user.name}</Text>
        <Text style={{ fontSize: 16, color: '#6B7280', marginBottom: 20 }}>{user.email}</Text>
      </View>

      <View style={{ backgroundColor: '#FFFFFF', borderRadius: 16, padding: 16, elevation: 2 }}>
        <Text style={{ fontSize: 18, fontWeight: '600', marginBottom: 12 }}>Account Details</Text>
        <Text style={{ fontSize: 16, marginBottom: 8 }}>Joined: January 2024</Text>
        <Text style={{ fontSize: 16, marginBottom: 8 }}>Role: Full Stack Developer</Text>
        <Text style={{ fontSize: 16, marginBottom: 8 }}>Status: Active</Text>
      </View>

      <TouchableOpacity
        style={{
          backgroundColor: '#3B82F6',
          borderRadius: 12,
          paddingVertical: 14,
          marginTop: 24,
          alignItems: 'center',
        }}>
        <Text style={{ color: '#FFFFFF', fontWeight: '600', fontSize: 16 }}>Edit Profile</Text>
      </TouchableOpacity>

      <TouchableOpacity
        style={{
          backgroundColor: '#EF4444',
          borderRadius: 12,
          paddingVertical: 14,
          marginTop: 16,
          alignItems: 'center',
        }}>
        <Text style={{ color: '#FFFFFF', fontWeight: '600', fontSize: 16 }}>Logout</Text>
      </TouchableOpacity>
    </ScrollView>
  );
};

export default Profile;