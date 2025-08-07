import { useState, useEffect } from "react";
import { setModules, addModule, editModule, updateModule, deleteModule }
  from "./reducer";
import { useSelector, useDispatch } from "react-redux";
import ModulesControls from "./ModulesControls";
import { BsGripVertical } from "react-icons/bs";
import LessonControlButtons from "./LessonControlButtons";
import ModuleControlButtons from "./ModuleControlButtons";
import { useParams } from "react-router";
import { FormControl } from "react-bootstrap";
import * as coursesClient from "../client";
import * as modulesClient from "./client";
import ModulesMUI from "./ModulesMUI";

export default function Modules() {
  const { currentUser } = useSelector((state: any) => state.accountReducer);
  const { cid } = useParams();
  const [moduleName, setModuleName] = useState("");
  const { modules } = useSelector((state: any) => state.modulesReducer);
  const dispatch = useDispatch();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  
  const saveModule = async (module: any) => {
    setError(null);
    try {
      console.log("Saving module:", module);
      await modulesClient.updateModule(module);
      dispatch(updateModule(module));
    } catch (err) {
      const error = err as Error;
      console.error("Error saving module:", error);
      setError(error.message);
    }
  };

  const removeModule = async (moduleId: string) => {
    setError(null);
    try {
      console.log("Removing module:", moduleId);
      await modulesClient.deleteModule(moduleId);
      dispatch(deleteModule(moduleId));
    } catch (err) {
      const error = err as Error;
      console.error("Error removing module:", error);
      setError(error.message);
    }
  };

  const createModuleForCourse = async () => {
    if (!cid) return;
    setError(null);
    try {
      console.log("Creating module for course:", cid, moduleName);
      const newModule = { name: moduleName, course: cid };
      const module = await coursesClient.createModuleForCourse(cid, newModule);
      dispatch(addModule(module));
    } catch (err) {
      const error = err as Error;
      console.error("Error creating module:", error);
      setError(error.message);
    }
  };

  const fetchModules = async () => {
    if (!cid) return;
    
    setLoading(true);
    setError(null);
    
    try {
      console.log("Fetching modules for course:", cid);
      const modules = await coursesClient.findModulesForCourse(cid as string);
      dispatch(setModules(modules));
    } catch (err) {
      const error = err as Error;
      console.error("Error fetching modules:", error);
      setError(error.message);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchModules();
  }, [cid]);

  // Use the Material UI version instead of Bootstrap
  return <ModulesMUI />;
}