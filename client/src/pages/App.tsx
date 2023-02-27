import axios from "axios";
import { useEffect, useState } from "react";
import Button from "../components/atoms/button";
import Input from "../components/atoms/inputs";
import Select from "../components/atoms/select";
import useArrayHook from "../hooks/useArray";

const AstronautBuilder = { name: "", planet: { id: 0, name: "", image: "" }, id: 0 };
type AstroForm = {id:number, name: string; planet: { id: number; name: string; image: string };  };
const App = () => {
  const [options, setOptions] = useState<{ value: string; label: string }[]>([]);
  const [astronautForm, setAstronautForm] = useState<AstroForm>(AstronautBuilder);
  const { array: astronauts, save, remove, update } = useArrayHook<AstroForm>([]);

  const GetPlanets = async () => {
    const { data } = await axios.get("http://localhost:4000/api/planets");
    const planetesOptions = data.map((item: { id: number; name: string }) => ({ value: item.id, label: item.name }));
    setOptions(planetesOptions);
  };

  const GetAstronaut = async () => {
    const { data } = await axios.get("http://localhost:4000/api/astronautes");
    save(data);
  };

  useEffect(() => {
    GetPlanets();
    GetAstronaut();
  }, []);

  const onSubmit = async () => {
    const body = {
      name: astronautForm.name,
      planet: astronautForm.planet.id,
    };
    const { status } = await axios.post("http://localhost:4000/api/astronautes/create", body);

    if (status) {
      setAstronautForm(AstronautBuilder);
      return GetAstronaut();
    }
  };

  const removeAstronaut = async (astronauts: AstroForm) => {
    const { status } = await axios.delete("http://localhost:4000/api/astronautes/" + astronauts.id);
    if (status) remove(astronauts.id);
  };

  const updateAstronaut = async (astronauts: AstroForm) => {
    const body = {
      name: astronautForm.name,
      id: astronautForm.id,
      planet: astronautForm.planet.id
    }
    const { status } = await axios.patch('http://localhost:4000/api/astronautes/update/' + astronauts.id,body)
    if (status) update(astronautForm)
  }

  return (
    <section className="container mx-auto  h-screen w-screen flex justify-center items-center">
      <form className="flex flex-col justify-center w-96 border-2 h-96 bg-bleu-600 p-5">
        <Input
          title="Astronaut"
          placeholder="Name"
          value={astronautForm.name}
          name="name"
          onChange={({ target }) => setAstronautForm((curr) => ({ ...curr, name: target.value }))}
        />
        <Select
          label="Planete"
          placeholder="Choisir"
          options={options}
          value={astronautForm?.planet?.id}
          onChange={({ target }) =>
            setAstronautForm((curr) => ({ ...curr, planet: { ...curr.planet, id: +target.value } }))
          }
        />
        <Button type="button" className="bg-blue-600 text-white font-bold m-3 p-2" onClick={() => {astronautForm.id ? updateAstronaut(astronautForm):onSubmit()  }}>
          {astronautForm.id ? "Modifier" : "Sauvegarder"}
        </Button>
      </form>
      <div>
        {astronauts.map((astronaut) => (
          <div key={astronaut.id} className="flex items-center">
            <div key={astronaut.id} className="border m-1 p-1 w-48 flex">
              <div className="flex items-center">
                <img className="w-14 mr-5" src={astronaut.planet.image} />
                <span>{astronaut.name}</span>
              </div>
            </div>
            <div className="flex flex-col">
              <Button onClick={() => removeAstronaut(astronaut)} className="bg-red-400 p-1">
                Supprimier
              </Button>
              <Button onClick={() => setAstronautForm(astronaut)} className="bg-green-300 p-1">
                Modifier
              </Button>
            </div>
          </div>
        ))}
      </div>
    </section>
  );
};

export default App;
