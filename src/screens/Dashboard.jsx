import { Pressable, StyleSheet, Text, View } from 'react-native';
import React, { useState } from 'react';
import AllItems from './AllItems';
import CreateItem from './CreateItem';


const Dashboard = () => {
  const[data,setData]=useState([
    { id: 1, name: 'Rice', stock: 5, unit: 'kg' },
    { id: 2, name: 'Wheat', stock: 10, unit: 'kg' },
    { id: 3, name: 'Sugar', stock: 3, unit: 'kg' },
    { id: 4, name: 'Milk', stock: 12, unit: 'kg' },
    { id: 5, name: 'Oil', stock: 7, unit: 'kg' },
    { id: 6, name: 'Salt', stock: 2, unit: 'kg' },
  ])
  const [view, setView] = useState(0);
  return (
    <View>
      <Text style={styles.Dashboard}>Dashboard</Text>
      <View style={styles.btnContainer}>
        <Pressable
          style={[styles.btn, view === 0 ? { backgroundColor: 'pink' } : null]}
          onPress={() => setView(0)}
        >
          <Text style={[styles.txt, view === 0 ? { color: 'white' } : null]}>
            All Items
          </Text>
        </Pressable>
        <Pressable
          style={[styles.btn, view === 1 ? { backgroundColor: 'pink' } : null]}
          onPress={() => setView(1)}
        >
          <Text style={[styles.txt, view === 1 ? { color: 'white' } : null]}>
            Low Stock
          </Text>
        </Pressable>
        <Pressable
          style={[styles.btn, view === 2 ? { backgroundColor: 'pink' } : null]}
          onPress={() => setView(2)}
        >
          <Text style={[styles.txt, view === 2 ? { color: 'white' } : null]}>
            Create Items
          </Text>
        </Pressable>
      </View>
      {view === 0 && <AllItems data={data} />}
      {view === 1 && <AllItems data={data.filter(item => item.stock <= 5)} />}
      {view === 2 && <CreateItem data={data} setData={setData} />}
    </View>
  );
};

export default Dashboard;

const styles = StyleSheet.create({
  Dashboard: {
    fontSize: 20,
    fontWeight: 500,
  },
  btnContainer: {
    flexDirection: 'row',
    gap: 10,
    paddingVertical: 10,
  },
  btn: {
    borderWidth: 1,
    borderColor: 'pink',
    paddingVertical: 5,
    paddingHorizontal: 10,
    borderRadius: 50,
  },
  txt: {
    fontSize: 14,
    color: 'pink',
  },
});
