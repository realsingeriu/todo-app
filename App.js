import { StatusBar } from "expo-status-bar";
import { theme } from "./color";
import {
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from "react-native";
import { useEffect, useState } from "react";
import AsyncStorage from "@react-native-async-storage/async-storage";

export default function App() {
  const [working, setWorking] = useState(true);
  const travel = () => setWorking(false);
  const work = () => setWorking(true);
  const [text, setText] = useState("");
  const onChangText = (payload) => setText(payload);
  const [scheduledTime, setScheduledTime] = useState(""); // 스케줄 시간 설정
  const [toDos, setToDos] = useState([]);

  const addTodo = () => {
    if (text === "" || scheduledTime === "") return;
    const newTodo = {
      id: Date.now(),
      text: text,
      working: working,
      scheduledTime: scheduledTime,
      timestamp: new Date().toLocaleString(),
      completed: false,
    };

    const newTodos = [...toDos, newTodo];

    setToDos(newTodos);
    saveToDos(newTodos);

    setText("");
    setScheduledTime("");
  };
  useEffect(() => {
    loadToDos();
  }, []);
  // 처음 시작시 저장된 할일들 가져오기
  const loadToDos = async () => {
    try {
      const s = await AsyncStorage.getItem("my-todos");
      setToDos(s != null ? JSON.parse(s) : []);
    } catch (e) {
      console.log(e);
    }
  };
  // 저장하기
  const saveToDos = async (toSave) => {
    try {
      await AsyncStorage.setItem("my-todos", JSON.stringify(toSave));
    } catch (e) {
      console.log(e);
    }
  };
  // 삭제하기
  const deleteTodo = (id) => {
    const newTodos = toDos.filter((todo) => todo.id !== id);
    setToDos(newTodos);
    saveToDos(newTodos);
  };
  // 완료하기
  const completeTodo = (id) => {
    const updatedTodos = toDos.map((todo) =>
      todo.id === id ? { ...todo, completed: !todo.completed } : todo
    );
    setToDos(updatedTodos);
    saveToDos(updatedTodos);
  };

  return (
    <View style={styles.container}>
      <StatusBar style="auto" />
      <View style={styles.header}>
        <TouchableOpacity onPress={work}>
          <Text
            style={{ ...styles.btnText, color: working ? "white" : theme.grey }}
          >
            Work
          </Text>
        </TouchableOpacity>
        <TouchableOpacity onPress={travel}>
          <Text
            style={{
              ...styles.btnText,
              color: !working ? "white" : theme.grey,
            }}
          >
            Travel
          </Text>
        </TouchableOpacity>
      </View>
      <View style={styles.content}>
        <TextInput
          onSubmitEditing={addTodo}
          returnKeyLabel="완료"
          onChangeText={onChangText}
          value={text}
          placeholder={working ? "할일 추가" : "어디로 여행 갈까요?"}
          style={styles.input}
        />
        <TextInput
          onSubmitEditing={addTodo}
          returnKeyLabel="완료"
          onChangeText={(payload) => setScheduledTime(payload)}
          value={scheduledTime}
          placeholder="예약 시간"
          style={styles.input}
        />
        <ScrollView style={styles.scrollView}>
          {toDos.map((todo) => {
            return todo.working === working ? (
              <View style={styles.toDo} key={todo.id}>
                <Text style={styles.toDoText}>할일: {todo.text}</Text>
                <Text style={{ color: "white", fontSize: 16 }}>
                  예약 시간: {todo.scheduledTime}
                </Text>
                <Text style={{ color: "white", fontSize: 14 }}>
                  타임 스탬프: {todo.timestamp}
                </Text>
                <TouchableOpacity
                  onPress={() => completeTodo(todo.id)}
                  style={{
                    marginLeft: "auto",
                    marginRight: 10,
                  }}
                >
                  <Text
                    style={{
                      color: todo.completed ? "green" : "green",
                      fontWeight: todo.completed ? "bold" : "normal",
                    }}
                  >
                    {todo.completed ? "완료" : "미완료"}
                  </Text>
                </TouchableOpacity>
                <TouchableOpacity
                  onPress={() => deleteTodo(todo.id)}
                  style={{ marginLeft: "auto" }}
                >
                  <Text>❌</Text>
                </TouchableOpacity>
              </View>
            ) : null;
          })}
        </ScrollView>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: theme.bg,
    paddingHorizontal: 20,
  },
  header: {
    justifyContent: "space-between",
    flexDirection: "row",
    marginTop: 100,
  },
  btnText: {
    fontSize: 38,
    fontWeight: "600",
    color: "white",
  },
  input: {
    backgroundColor: "white",
    paddingVertical: 15,
    paddingHorizontal: 20,
    marginVertical: 20,
    borderRadius: 30,
    marginTop: 20,
    fontSize: 18,
  },
  toDo: {
    backgroundColor: theme.grey,
    marginBottom: 10,
    paddingVertical: 20,
    paddingHorizontal: 20,
    borderRadius: 15,
    flexDirection: "column",
    alignItems: "flex-start",
    justifyContent: "space-between",
  },
  toDoText: {
    color: "white",
    fontSize: 16,
    fontWeight: "500",
  },
  content: {
    flex: 1,
  },
  scrollView: {
    flexGrow: 1,
  },
});
