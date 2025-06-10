import React from 'react';
import { View, StyleSheet } from 'react-native';
import auth from '@react-native-firebase/auth';
import Item from '../../components/Item';
import BntAdd from '../../components/BtnAdd';
import LoggedUser from '../../components/LoggedUser';

const Page = () => {
  const user = auth().currentUser;
  const tarefas = [
    { titulo: 'tarefa 001' },
    { titulo: 'tarefa 002' },
    { titulo: 'tarefa 003' },
  ];

  const handleAddTask = () => {
    alert('Adicionar nova tarefa');
  };

  const handleLogout = () => {
    auth().signOut();
  };

  return (
    <View style={styles.container}>
      <LoggedUser email={user?.email ?? "Convidado" } onLogout={handleLogout} />

      <Item
        data={tarefas}
        onDelete={() => alert('evento do componente de exclusão')}
        onEdit={() => alert('evento do componente de edição')}
      />

      <BntAdd onPress={handleAddTask} />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 16,
    position: 'relative',
  },
});

export default Page;
