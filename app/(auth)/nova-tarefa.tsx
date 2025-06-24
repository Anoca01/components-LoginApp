// app/(auth)/nova-tarefa.tsx
import auth from '@react-native-firebase/auth';
import firestore from '@react-native-firebase/firestore';
import { useRouter } from 'expo-router';
import { useState } from 'react';
import { Alert, Button, StyleSheet, TextInput, View } from 'react-native';

export default function NovaTarefa() {
  const [titulo, setTitulo] = useState('');
  const router = useRouter();
  const user = auth().currentUser;

  const handleSalvar = async () => {
    if (!titulo.trim() || !user) return;

    try {
      await firestore().collection('tarefas').add({
        titulo,
        userId: user.uid,
        createdAt: firestore.FieldValue.serverTimestamp(),
      });

      Alert.alert('Sucesso', 'Tarefa adicionada!');
      router.back(); // ou router.replace('(auth)/'); se quiser voltar pra Home
    } catch (err) {
      console.error('Erro ao salvar:', err);
    }
  };

  return (
    <View style={styles.container}>
      <TextInput
        placeholder="Título da tarefa"
        value={titulo}
        onChangeText={setTitulo}
        style={styles.input}
      />
      <Button title="Gravar tarefa" onPress={handleSalvar} />
    </View>
  );
}

const styles = StyleSheet.create({
  container: { padding: 20 },
  input: {
    borderWidth: 1,
    borderColor: '#CCC',
    borderRadius: 8,
    padding: 12,
    marginBottom: 16,
  },
});