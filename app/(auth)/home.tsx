import auth from '@react-native-firebase/auth';
import firestore from '@react-native-firebase/firestore';
import { useRouter } from 'expo-router';
import { useEffect, useState } from 'react';
import React, { Alert, StyleSheet, View } from 'react-native';

import BntAdd from '../../components/BtnAdd';
import Item from '../../components/Item';
import LoggedUser from '../../components/LoggedUser';

interface Tarefa {
  id: string;
  titulo: string;
}

const Page = () => {
  const user = auth().currentUser;
  const router = useRouter();
  const [tarefas, setTarefas] = useState<Tarefa[]>([]);

  useEffect(() => {
    if (!user) return;

    const unsubscribe = firestore()
      .collection('tarefas')
      .where('userId', '==', user.uid)
      .orderBy('createdAt', 'desc')
      .onSnapshot(snapshot => {
        const lista = snapshot.docs?.map(doc => ({
          id: doc.id,
          titulo: doc.data().titulo,
        }));
        setTarefas(lista);
      });

    return () => unsubscribe();
  }, []);

  const handleDeleteTask = async (id: string) => {
    try {
      await firestore().collection('tarefas').doc(id).delete();
    } catch (error) {
      console.error('Erro ao deletar tarefa:', error);
      Alert.alert('Erro', 'Não foi possível excluir a tarefa.');
    }
  };

  const handleLogout = () => {
    auth().signOut();
  };

  return (
    <View style={styles.container}>
      <LoggedUser email={user?.email ?? "Convidado"} onLogout={handleLogout} />


      <Item
        data={tarefas}
        onDelete={(id) => handleDeleteTask(id)}
        onEdit={(id) => router.push({ pathname: '(auth)/editar-tarefa', params: { id } })}
      />


      <BntAdd onPress={() => router.push('(auth)/nova-tarefa')} />
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