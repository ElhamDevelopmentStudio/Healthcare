import { useEffect } from "react";
import { useAppDispatch, useAppSelector } from "../redux/store";
import {
  fetchDoctorById,
  selectSelectedDoctor,
  selectDoctorsStatus,
  selectDoctorsError,
} from "../redux/slices/DoctorSlice";

export const useDoctorDetails = (id: string | undefined) => {
  const dispatch = useAppDispatch();
  const doctor = useAppSelector(selectSelectedDoctor);
  const status = useAppSelector(selectDoctorsStatus);
  const error = useAppSelector(selectDoctorsError);

  useEffect(() => {
    if (id) {
      dispatch(fetchDoctorById(id));
    }
  }, [dispatch, id]);

  return { doctor, status, error };
};
