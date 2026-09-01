// components/IconModal.tsx
import { iconCategories, uniqueIcons } from "@/utils/iconCategories";
import { Ionicons } from "@expo/vector-icons";
import React, { useMemo, useState } from "react";
import {
  FlatList,
  Modal,
  Pressable,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from "react-native";

interface IconModalProps {
  visible: boolean;
  onClose: () => void;
  onSelect: (iconName: string) => void;
}

export default function IconModal({
  visible,
  onClose,
  onSelect,
}: IconModalProps) {
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedTab, setSelectedTab] = useState<"Icon" | "Emoji">("Icon");

  // Filter icons based on search query
  const filteredCategories = useMemo(() => {
    if (!searchQuery.trim()) {
      return iconCategories;
    }

    const query = searchQuery.toLowerCase();
    return iconCategories
      .map((category) => ({
        ...category,
        icons: category.icons.filter((icon) =>
          icon.toLowerCase().includes(query)
        ),
      }))
      .filter((category) => category.icons.length > 0);
  }, [searchQuery]);

  // Filter all icons for search (flat list)
  const filteredAllIcons = useMemo(() => {
    if (!searchQuery.trim()) {
      return [];
    }
    const query = searchQuery.toLowerCase();
    return uniqueIcons.filter((icon) => icon.toLowerCase().includes(query));
  }, [searchQuery]);

  const handleIconSelect = (iconName: string) => {
    onSelect(iconName);
    onClose();
    // Reset search when closing
    setSearchQuery("");
  };

  // Render icon item with unique key (for search view)
  const renderIconItem = (icon: string, index: number) => (
    <TouchableOpacity
      key={`icon-${icon}-${index}`}
      className="items-center justify-center"
      style={{ width: "14.28%", paddingVertical: 12, paddingHorizontal: 4 }}
      onPress={() => handleIconSelect(icon)}
    >
      <Ionicons name={icon as any} size={28} color="#fff" />
    </TouchableOpacity>
  );

  // Render icon item within category (with category prefix for unique key)
  const renderCategoryIcon = (
    icon: string,
    index: number,
    categoryName: string
  ) => (
    <TouchableOpacity
      key={`${categoryName}-${icon}-${index}`}
      className="items-center justify-center"
      style={{ width: "14.28%", paddingVertical: 12, paddingHorizontal: 4 }}
      onPress={() => handleIconSelect(icon)}
    >
      <Ionicons name={icon as any} size={28} color="#fff" />
    </TouchableOpacity>
  );

  const renderCategory = ({ item }: { item: (typeof iconCategories)[0] }) => (
    <View className="mb-6">
      <Text className="text-white text-lg font-semibold mb-3 px-1">
        {item.name}
      </Text>
      <View className="flex-row flex-wrap" style={{ marginHorizontal: -4 }}>
        {item.icons.map((icon, index) =>
          renderCategoryIcon(icon, index, item.name)
        )}
      </View>
    </View>
  );

  return (
    <Modal
      visible={visible}
      transparent={false}
      animationType="slide"
      onRequestClose={onClose}
    >
      {/* Full screen dark overlay */}
      <Pressable
        style={StyleSheet.absoluteFill}
        className="bg-neutral-900"
        onPress={onClose}
      />

      {/* Modal content - overlays the pressable */}
      <Pressable
        onPress={(e) => e.stopPropagation()}
        className="bg-neutral-900 flex-1"
        style={{ position: "absolute", bottom: 0, left: 0, right: 0, top: 0 }}
      >
        {/* Header */}
        <View className="flex-row items-center px-5 pt-6 pb-4">
          <TouchableOpacity onPress={onClose}>
            <Ionicons name="arrow-back" size={28} color="white" />
          </TouchableOpacity>
        </View>

        {/* Segmented Control */}
        <View className="flex-row px-5 mb-4">
          <TouchableOpacity
            onPress={() => setSelectedTab("Icon")}
            className={`flex-1 py-3 rounded-full mr-2 border border-neutral-700  ${
              selectedTab === "Icon" ? "bg-neutral-800" : "bg-neutral-900"
            }`}
          >
            <Text
              className={`text-center font-semibold ${
                selectedTab === "Icon" ? "text-white" : "text-neutral-400"
              }`}
            >
              Icon
            </Text>
          </TouchableOpacity>
          <TouchableOpacity
            onPress={() => setSelectedTab("Emoji")}
            className={`flex-1 py-3 rounded-full ml-2 border border-neutral-700 ${
              selectedTab === "Emoji" ? "bg-neutral-800" : "bg-neutral-900"
            }`}
          >
            <Text
              className={`text-center font-semibold ${
                selectedTab === "Emoji" ? "text-white" : "text-neutral-400"
              }`}
            >
              Emoji
            </Text>
          </TouchableOpacity>
        </View>

        {/* Search Bar */}
        <View className="px-5 mb-4">
          <View className="flex-row items-center bg-neutral-800 rounded-full px-4 py-2 border border-neutral-700 ">
            <Ionicons name="search-outline" size={20} color="#777" />
            <TextInput
              className="flex-1 text-white ml-3"
              placeholder="Type a search term"
              placeholderTextColor="#777"
              value={searchQuery}
              onChangeText={setSearchQuery}
            />
            {searchQuery.length > 0 && (
              <TouchableOpacity onPress={() => setSearchQuery("")}>
                <Ionicons name="close-circle" size={20} color="#777" />
              </TouchableOpacity>
            )}
          </View>
        </View>

        {/* Icons List - Scrollable */}
        <ScrollView
          className="flex-1 bg-neutral-900"
          contentContainerStyle={{
            paddingHorizontal: 20,
            paddingBottom: 50,
          }}
          showsVerticalScrollIndicator={true}
          nestedScrollEnabled={true}
        >
          {selectedTab === "Icon" ? (
            searchQuery.trim() ? (
              // Show flat list when searching
              <View
                className="flex-row flex-wrap"
                style={{ marginHorizontal: -4 }}
              >
                {filteredAllIcons.map((icon, index) =>
                  renderIconItem(icon, index)
                )}
              </View>
            ) : (
              // Show categorized list when not searching
              <FlatList
                data={filteredCategories}
                renderItem={renderCategory}
                keyExtractor={(item) => item.name}
                scrollEnabled={false}
                nestedScrollEnabled={true}
              />
            )
          ) : (
            // Emoji section (placeholder for now)
            <View className="items-center justify-center py-20">
              <Text className="text-neutral-400 text-lg">
                Emoji feature coming soon
              </Text>
            </View>
          )}
        </ScrollView>
      </Pressable>
    </Modal>
  );
}
