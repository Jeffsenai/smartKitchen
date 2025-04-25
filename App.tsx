import React, { useState } from 'react';
import { StyleSheet, Text, View, TextInput, TouchableOpacity, Platform, StatusBar, ScrollView, ActivityIndicator, Alert, Keyboard } from 'react-native';
import { MaterialIcons } from '@expo/vector-icons';
import { NavigationContainer } from '@react-navigation/native';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';

const Tab = createBottomTabNavigator();
const KEY_GPT = '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';
const alturaStatusBar = StatusBar.currentHeight;

function HomeScreen() {
  const [load, setLoad] = useState(false);
  const [receita, setReceita] = useState("");
  const [ingr1, setIngr1] = useState("");
  const [ingr2, setIngr2] = useState("");
  const [ingr3, setIngr3] = useState("");
  const [ingr4, setIngr4] = useState("");
  const [ocasiao, setOcasiao] = useState("");

  async function gerarReceita() {
    if ([ingr1, ingr2, ingr3, ingr4, ocasiao].some(v => v === "")) {
      Alert.alert("Atenção", "Informe todos os ingredientes e ocasião!", [{ text: "OK" }]);
      return;
    }
    setReceita("");
    setLoad(true);
    Keyboard.dismiss();
    const prompt = `Sugira uma receita detalhada para ${ocasiao} usando os ingredientes: ${ingr1}, ${ingr2}, ${ingr3} e ${ingr4}.`;
    try {
      const res = await fetch("https://api.openai.com/v1/chat/completions", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${KEY_GPT}`,
        },
        body: JSON.stringify({
          model: "gpt-4o-mini",
          messages: [{ role: "user", content: prompt }],
          temperature: 0.2,
          max_tokens: 500,
        }),
      });
      const data = await res.json();
      setReceita(data.choices[0].message.content);
    } catch (error) {
      Alert.alert("Erro", "Falha ao gerar receita.");
    } finally {
      setLoad(false);
    }
  }

  return (
    <View style={styles.container}>
      <StatusBar barStyle="dark-content" translucent backgroundColor="#F1F1F1" />
      <Text style={styles.header}>Cozinha Fácil</Text>
      <ScrollView contentContainerStyle={{ paddingBottom: 24 }} style={styles.form} keyboardShouldPersistTaps="handled">
        <Text style={styles.label}>Insira os ingredientes:</Text>
        {[ingr1, ingr2, ingr3, ingr4].map((val, i) => (
          <TextInput
            key={i}
            placeholder={`Ingrediente ${i + 1}`}
            style={styles.input}
            value={val}
            onChangeText={text => [setIngr1, setIngr2, setIngr3, setIngr4][i](text)}
          />
        ))}
        <TextInput
          placeholder="Almoço ou Jantar"
          style={styles.input}
          value={ocasiao}
          onChangeText={setOcasiao}
        />
        <TouchableOpacity style={styles.button} onPress={gerarReceita}>
          <Text style={styles.buttonText}>Gerar Receita</Text>
          <MaterialIcons name="restaurant-menu" size={24} color="#FFF" />
        </TouchableOpacity>

        {load && <ActivityIndicator size="large" color="red" style={{ marginTop: 16 }} />}
        {receita !== "" && (
          <View style={styles.result}>
            <Text style={styles.title}>Sua Receita:</Text>
            <Text style={styles.text}>{receita}</Text>
          </View>
        )}
      </ScrollView>
    </View>
  );
}

function TelaFilmes() {
  const [load, setLoad] = useState(false);
  const [sugestao, setSugestao] = useState("");
  const [p1, setP1] = useState("");
  const [p2, setP2] = useState("");
  const [p3, setP3] = useState("");
  const [faixa, setFaixa] = useState("");

  async function gerarFilme() {
    if ([p1, p2, p3, faixa].some(v => v === "")) {
      Alert.alert("Atenção", "Preencha todos os campos!", [{ text: "OK" }]);
      return;
    }
    setSugestao("");
    setLoad(true);
    Keyboard.dismiss();
    const prompt = `Sugira um filme para faixa etária ${faixa} que envolva: ${p1}, ${p2} e ${p3}, e informe um link de trailer no YouTube.`;
    try {
      const res = await fetch("https://api.openai.com/v1/chat/completions", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${KEY_GPT}`,
        },
        body: JSON.stringify({ model: "gpt-4o-mini", messages: [{ role: "user", content: prompt }], temperature: 0.2, max_tokens: 300 }),
      });
      const data = await res.json();
      setSugestao(data.choices[0].message.content);
    } catch {
      Alert.alert("Erro", "Falha ao gerar sugestão.");
    } finally {
      setLoad(false);
    }
  }

  return (
    <View style={styles.container}>
      <Text style={styles.header}>Sugestão de Filme</Text>
      <ScrollView contentContainerStyle={{ paddingBottom: 24 }} style={styles.form} keyboardShouldPersistTaps="handled">
        {[p1, p2, p3].map((val, i) => (
          <TextInput
            key={i}
            placeholder={`Parâmetro ${i + 1}`}
            style={styles.input}
            value={val}
            onChangeText={[setP1, setP2, setP3][i]}
          />
        ))}
        <TextInput
          placeholder="Faixa Etária"
          style={styles.input}
          value={faixa}
          onChangeText={setFaixa}
        />
        <TouchableOpacity style={styles.button} onPress={gerarFilme}>
          <Text style={styles.buttonText}>Gerar Filme</Text>
          <MaterialIcons name="movie" size={24} color="#FFF" />
        </TouchableOpacity>
        {load && <ActivityIndicator size="large" color="red" style={{ marginTop: 16 }} />}
        {sugestao !== "" && (
          <View style={styles.result}>
            <Text style={styles.title}>Sua Sugestão:</Text>
            <Text style={styles.text}>{sugestao}</Text>
          </View>
        )}
      </ScrollView>
    </View>
  );
}

function TelaCurso() {
  const [load, setLoad] = useState(false);
  const [curso, setCurso] = useState("");
  const [f1, setF1] = useState("");
  const [f2, setF2] = useState("");
  const [m1, setM1] = useState("");
  const [m2, setM2] = useState("");

  async function gerarCurso() {
    if ([f1, f2, m1, m2].some(v => v === "")) {
      Alert.alert("Atenção", "Preencha todos os pontos fortes e matérias!", [{ text: "OK" }]);
      return;
    }
    setCurso("");
    setLoad(true);
    Keyboard.dismiss();
    const prompt = `Com base nos meus pontos fortes: ${f1}, ${f2} e minhas matérias favoritas: ${m1}, ${m2}, qual curso devo fazer?`;
    try {
      const res = await fetch("https://api.openai.com/v1/chat/completions", {
        method: "POST",
        headers: { "Content-Type": "application/json", Authorization: `Bearer ${KEY_GPT}` },
        body: JSON.stringify({ model: "gpt-4o-mini", messages: [{ role: "user", content: prompt }], temperature: 0.2, max_tokens: 300 }),
      });
      const data = await res.json();
      setCurso(data.choices[0].message.content);
    } catch {
      Alert.alert("Erro", "Falha ao gerar sugestão de curso.");
    } finally {
      setLoad(false);
    }
  }

  return (
    <View style={styles.container}>
      <Text style={styles.header}>Qual Curso?</Text>
      <ScrollView contentContainerStyle={{ paddingBottom: 24 }} style={styles.form} keyboardShouldPersistTaps="handled">
        {[f1, f2].map((val, i) => (
          <TextInput key={i} placeholder={`Ponto Forte ${i + 1}`} style={styles.input} value={val} onChangeText={[setF1, setF2][i]} />
        ))}
        {[m1, m2].map((val, i) => (
          <TextInput key={i+2} placeholder={`Matéria Favorita ${i + 1}`} style={styles.input} value={[m1, m2][i]} onChangeText={[setM1, setM2][i]} />
        ))}
        <TouchableOpacity style={styles.button} onPress={gerarCurso}>
          <Text style={styles.buttonText}>Gerar Curso</Text>
          <MaterialIcons name="school" size={24} color="#FFF" />
        </TouchableOpacity>
        {load && <ActivityIndicator size="large" color="red" style={{ marginTop: 16 }} />}
        {curso !== "" && (
          <View style={styles.result}>
            <Text style={styles.title}>Sugestão de Curso:</Text>
            <Text style={styles.text}>{curso}</Text>
          </View>
        )}
      </ScrollView>
    </View>
  );
}

function TelaFriends() {
  const [load, setLoad] = useState(false);
  const [perfil, setPerfil] = useState("");
  const [c1, setC1] = useState("");
  const [c2, setC2] = useState("");
  const [c3, setC3] = useState("");
  const [c4, setC4] = useState("");

  async function gerarPerfil() {
    if ([c1, c2, c3, c4].some(v => v === "")) {
      Alert.alert("Atenção", "Preencha todas as características!", [{ text: "OK" }]);
      return;
    }
    setPerfil("");
    setLoad(true);
    Keyboard.dismiss();
    const prompt = `Com base nas características: ${c1}, ${c2}, ${c3}, ${c4}, qual personagem de Friends eu seria e por quê?`;
    try {
      const res = await fetch("https://api.openai.com/v1/chat/completions", {
        method: "POST",
        headers: { "Content-Type": "application/json", Authorization: `Bearer ${KEY_GPT}` },
        body: JSON.stringify({ model: "gpt-4o-mini", messages: [{ role: "user", content: prompt }], temperature: 0.2, max_tokens: 300 }),
      });
      const data = await res.json();
      setPerfil(data.choices[0].message.content);
    } catch {
      Alert.alert("Erro", "Falha ao gerar perfil.");
    } finally {
      setLoad(false);
    }
  }

  return (
    <View style={styles.container}>
      <Text style={styles.header}>Qual Personagem de Friends?</Text>
      <ScrollView contentContainerStyle={{ paddingBottom: 24 }} style={styles.form} keyboardShouldPersistTaps="handled">
        {[c1, c2, c3, c4].map((val, i) => (
          <TextInput key={i} placeholder={`Característica ${i + 1}`} style={styles.input} value={val} onChangeText={[setC1, setC2, setC3, setC4][i]} />
        ))}
        <TouchableOpacity style={styles.button} onPress={gerarPerfil}>
          <Text style={styles.buttonText}>Descobrir</Text>
          <MaterialIcons name="people" size={24} color="#FFF" />
        </TouchableOpacity>
        {load && <ActivityIndicator size="large" color="red" style={{ marginTop: 16 }} />}
        {perfil !== "" && (
          <View style={styles.result}>
            <Text style={styles.title}>Você é:</Text>
            <Text style={styles.text}>{perfil}</Text>
          </View>
        )}
      </ScrollView>
    </View>
  );
}

export default function App() {
  return (
    <NavigationContainer>
      <Tab.Navigator
        screenOptions={({ route }) => ({
          headerShown: false,
          tabBarIcon: ({ color, size }) => {
            let iconName;
            if (route.name === 'Home') iconName = 'home';
            else if (route.name === 'Filme') iconName = 'movie';
            else if (route.name === 'Curso') iconName = 'school';
            else if (route.name === 'Friends') iconName = 'people';
            return <MaterialIcons name={iconName} size={size} color={color} />;
          },
          tabBarActiveTintColor: '#FF5656',
          tabBarInactiveTintColor: '#94a3b8',
        })}
      >
        <Tab.Screen name="Home" component={HomeScreen} />
        <Tab.Screen name="Filme" component={TelaFilmes} />
        <Tab.Screen name="Curso" component={TelaCurso} />
        <Tab.Screen name="Friends" component={TelaFriends} options={{ title: 'Friends' }} />
      </Tab.Navigator>
    </NavigationContainer>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f1f1f1',
    paddingTop: Platform.OS === 'android' ? alturaStatusBar : 54,
    alignItems: 'center',
  },
  header: {
    fontSize: 28,
    fontWeight: 'bold',
    marginVertical: 16,
  },
  form: {
    width: '90%',
  },
  label: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 8,
  },
  input: {
    borderWidth: 1,
    borderColor: '#94a3b8',
    borderRadius: 6,
    padding: 10,
    fontSize: 16,
    marginBottom: 12,
    backgroundColor: '#fff',
  },
  button: {
    flexDirection: 'row',
    backgroundColor: '#FF5656',
    padding: 14,
    borderRadius: 8,
    justifyContent: 'center',
    alignItems: 'center',
    gap: 8,
    marginTop: 8,
  },
  buttonText: {
    color: '#fff',
    fontSize: 18,
    fontWeight: 'bold',
  },
  result: {
    backgroundColor: '#fff',
    padding: 16,
    borderRadius: 8,
    marginTop: 16,
  },
  title: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 8,
  },
  text: {
    lineHeight: 22,
    fontSize: 16,
  },
});
