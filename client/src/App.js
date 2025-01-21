import logo from "./logo.svg";
import "./App.css";
import { gql, useQuery } from "@apollo/client";

const query = gql`
  query GetAllTodos {
    todos {
      id
      title
      done
      user {
        id
        name
      }
    }
  }
`;

function App() {
  const { loading, error, data } = useQuery(query);
  if (loading) return <h1>Loading...</h1>;
console.log("data", data)
  return (
    <div className="App">
      {data.todos.map((todo) => (
        <tr key={todo.id}>
          <td>{todo.title}</td>
          <td>{todo?.user?.name}</td>
        </tr>
      ))}
    </div>
  );
}

export default App;
