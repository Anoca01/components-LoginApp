import auth from '@react-native-firebase/auth';
import firestore from '@react-native-firebase/firestore';
import { useLocalSearchParams, useRouter } from 'expo-router';
import { useEffect, useState } from 'react';
import { Alert, Button, StyleSheet, TextInput, View, Text } from 'react-native';
export default function EditarTarefa() {
  const { id } = useLocalSearchParams<{ id: string }>();
  const [titulo, setTitulo] = useState('');
  const router = useRouter();
  const user = auth().currentUser;

useEffect(() => {
  const carregarTarefa = async () => {
    if (!id || !user) return;

    try {
      const doc = await firestore()?.collection('tarefas')?.doc(String(id)).get();

      const dados = doc.data();

      if (dados) {
        setTitulo(dados.titulo || '');
      } else {
        Alert.alert('Erro', 'Tarefa não encontrada.');
        router.back();
      }
    } catch (error) {
      console.error('Erro ao carregar tarefa:', error);
      Alert.alert('Erro', 'Não foi possível carregar a tarefa.');
    }
  };

  carregarTarefa();
}, [id]);

  const handleAtualizar = async () => {
    if (!titulo.trim() || !user) {
      Alert.alert('Atenção', 'Título não pode estar vazio.');
      return;
    }

    try {
      await firestore().collection('tarefas').doc(String(id)).update({
        titulo,
      });

      Alert.alert('Sucesso', 'Tarefa atualizada!');
      router.back();
    } catch (error) {
      console.error('Erro ao atualizar tarefa:', error);
      Alert.alert('Erro', 'Não foi possível atualizar a tarefa.');
    }
  };

  return (
    <View style={styles.container}>
      <Text style={styles.label}>Editar título da tarefa</Text>
      <TextInput
        placeholder="Novo título da tarefa"
        value={titulo}
        onChangeText={setTitulo}
        style={styles.input}
      />
      <Button title="Atualizar Tarefa" onPress={handleAtualizar} />
    </View>
  );
}

const styles = StyleSheet.create({
  container: { padding: 20, flex: 1, backgroundColor: '#fff' },
  input: {
    borderWidth: 1,
    borderColor: '#CCC',
    borderRadius: 8,
    padding: 12,
    marginBottom: 16,
  },
  label: {
    fontSize: 18,
    marginBottom: 8,
    fontWeight: 'bold',
  },
});
