import React from "react";
import {
  ModalPopup,
  Modal,
  ModalBody,
  ModalHeader,
  Input,
  FieldMeta,
} from "tinacms";
import { Button } from "@tinacms/styles";
import { useForm } from "react-hook-form";
import { Credentials, useAuth } from "./AuthProvider";

export const LoginModal = () => {
  const { register, handleSubmit } = useForm<Credentials>();
  const { login } = useAuth();
  const onSubmit = async (data: Credentials) => {
    await login({
      ...data,
    });
  };
  return (
    <ModalLayout name="Reauthenticate">
      <form onSubmit={handleSubmit(onSubmit)}>
        <FieldMeta aria-labelledby="email" name="email" label="E-mail">
          <Input data-testid="email" name="email" ref={register}></Input>
        </FieldMeta>
        <FieldMeta aria-labelledby="password" name="password" label="Password">
          <Input
            data-testid="password"
            name="password"
            type="password"
            ref={register}
          ></Input>
        </FieldMeta>
        <Button primary>Login</Button>
      </form>
    </ModalLayout>
  );
};
interface ModalProps {
  children: any;
  name: string;
}
const ModalLayout = ({ children, name }: ModalProps) => {
  return (
    <Modal>
      <ModalPopup>
        <ModalHeader>{name}</ModalHeader>
        <ModalBody padded>{children}</ModalBody>
      </ModalPopup>
    </Modal>
  );
};
