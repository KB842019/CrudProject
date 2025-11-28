import {
  Alert,
  FlatList,
  Pressable,
  StyleSheet,
  Text,
  TextInput,
  View,
} from 'react-native';
import React, { useState } from 'react';

const CreateItem = ({ data, setData }) => {
  const [item, setItem] = useState('');
  const [stock, setStock] = useState('');
  const [editId, setEditId] = useState(null);

  // ADD OR UPDATE ITEM
  const addItem = () => {
    if (!item || !stock) {
      Alert.alert('Error', 'Please enter item name and quantity');
      return;
    }

    if (editId) {
      // UPDATE ITEM
      const updatedData = data.map(i =>
        i.id === editId ? { ...i, name: item, stock: Number(stock) } : i
      );
      setData(updatedData);
      setEditId(null);
    } else {
      // ADD ITEM
      const newItem = {
        id: Date.now(),
        name: item,
        stock: Number(stock),
      };
      setData([...data, newItem]);
    }

    setItem('');
    setStock('');
  };

  // DELETE ITEM
  const deleteItem = id => {
    Alert.alert('Delete Item', 'Are you sure you want to delete this item?', [
      { text: 'Cancel' },
      {
        text: 'Delete',
        onPress: () => setData(data.filter(item => item.id !== id)),
      },
    ]);
  };

  // PRE-FILL EDIT DATA
  const startEdit = item => {
    setEditId(item.id);
    setItem(item.name);
    setStock(String(item.stock));
  };

  return (
    <View style={styles.container}>
      <Text style={styles.heading}>
        {editId ? 'Edit Item' : 'Add Item To Stock'}
      </Text>

      <TextInput
        value={item}
        onChangeText={value => setItem(value)}
        style={styles.input}
        placeholder="Enter item to stock..."
      />

      <TextInput
        value={stock}
        onChangeText={value => {
          const numericValue = value.replace(/[^0-9]/g, '');
          setStock(numericValue);
        }}
        style={styles.input}
        placeholder="Enter item quantity..."
        keyboardType="numeric"
      />

      <Pressable style={styles.btn} onPress={addItem}>
        <Text style={styles.txt}>
          {editId ? 'Update Item' : 'Add Item To Stock'}
        </Text>
      </Pressable>

      {/* DISPLAY LIST */}
      <View>
        <View style={styles.header}>
          <Text style={styles.headerTxt}>Item</Text>
          <Text style={styles.headerTxt}>Qty</Text>
          <Text style={styles.headerTxt}>Actions</Text>
        </View>

        <FlatList
          data={data}
          keyExtractor={item => item.id.toString()}
          renderItem={({ item }) => (
            <View
              style={[
                styles.row,
                item.stock > 5
                  ? { backgroundColor: '#b3f2aa' }
                  : { backgroundColor: '#f0c5c9' },
              ]}
            >
              <Text style={styles.itemTxt}>{item.name}</Text>
              <Text style={styles.itemTxt}>{item.stock}</Text>

              <View style={styles.actionBtns}>
                {/* EDIT BUTTON */}
                <Pressable onPress={() => startEdit(item)}>
                  <Text style={styles.edit}>✏️</Text>
                </Pressable>

                {/* DELETE BUTTON */}
                <Pressable onPress={() => deleteItem(item.id)}>
                  <Text style={styles.delete}>🗑️</Text>
                </Pressable>
              </View>
            </View>
          )}
        />
      </View>
    </View>
  );
};

export default CreateItem;

const styles = StyleSheet.create({
  container: {
    paddingVertical: 10,
    gap: 5,
  },
  heading: {
    fontSize: 18,
    fontWeight: '700',
    marginBottom: 5,
  },
  input: {
    borderWidth: 1,
    borderColor: 'pink',
    paddingHorizontal: 10,
    borderRadius: 5,
  },
  btn: {
    borderWidth: 1,
    borderColor: 'transparent',
    alignItems: 'center',
    paddingVertical: 10,
    borderRadius: 5,
    backgroundColor: 'lightgreen',
  },
  txt: {
    fontSize: 16,
    fontWeight: '600',
  },
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
    marginVertical: 4,
    paddingHorizontal: 10,
  },
  itemTxt: {
    fontSize: 14,
    fontWeight: '500',
    width: '30%',
  },
  actionBtns: {
    flexDirection: 'row',
    gap: 10,
  },
  edit: {
    fontSize: 20,
  },
  delete: {
    fontSize: 20,
  },
});
