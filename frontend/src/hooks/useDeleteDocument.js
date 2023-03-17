import { useState } from "react"
import { useAuthContext } from "./useAuthContext";

export const useDeleteDocument = () => {
  const [error, setError] = useState(null);
  const [isLoading, setIsLoading] = useState(null);
  
  const { user } = useAuthContext();

  const deleteDocument = async ({_id,dispatch, model, route}) => {
    setIsLoading(true);

    // don't want to show the error if the user is trying to rectify, so null error at the start
    setError(null);

    const response = await fetch(`/api/${route}/${_id}`, {
      method: 'DELETE',
      headers: {
        'Content-Type': 'application/json',
        'Authentication': `Bearer ${user.token}`
      }
    });

    // expecting the deleted document
    const json = await response.json();

    if (!response.ok) {
      console.log(json);

      setError(json.error);
      setIsLoading(false);
      return false;
    };

    if (response.ok) {
      setError(null);
      setIsLoading(false);

      dispatch({ type: `DELETE_${model}`, payload: json });
      return true;
    };
  };

  return { deleteDocument, isLoading, error };
};