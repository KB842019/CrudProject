import { Alert, FlatList, StyleSheet, Text, View } from 'react-native';
import React, { useEffect } from 'react';

const AllItems = ({ data }) => {
  return (
    <View>
      <View style={styles.header}>
        <Text style={styles.headerTxt}>Item</Text>
        <Text style={styles.headerTxt}>Quantity</Text>
      </View>

      <FlatList
        data={data}
        keyExtractor={item => item.id.toString()}
        renderItem={({ item }) => (
          <View
            style={[
              styles.row,
              item.stock > 5 ? { backgroundColor: '#b3f2aa' } : null,
            ]}
          >
            <Text style={[styles.itemTxt]}>{item.name}</Text>
            <Text style={styles.itemTxt}>{item.stock}</Text>
          </View>
        )}
      />
    </View>
  );
};

export default AllItems;

const styles = StyleSheet.create({
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingVertical: 8,
  },
  headerTxt: {
    fontSize: 16,
    fontWeight: '600',
  },
  row: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    borderRadius: 6,
    paddingVertical: 10,
    backgroundColor: '#f0c5c9',
    marginVertical: 4,
    paddingHorizontal: 10,
  },
  itemTxt: {
    fontSize: 14,
    fontWeight: '500',
  },
});
