import { createBrowserClient } from "../lib/createDirectusClient";
import { DirectusContext, useDirectusClient } from "./useDirectus";
import React, { ReactNode, useEffect, useMemo } from "react";
import { usePreview } from "./usePreview";
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

export function DirectusProvider({
  children,
  Unauthenticated,
}: {
  children: ReactNode;
  Unauthenticated?: React.FC;
}) {
  const preview = usePreview();
  const client = useMemo(() => createBrowserClient(), []);
  return (
    <DirectusContext.Provider value={client}>
      {preview ? (
        <AuthWrapper Unauthenticated={Unauthenticated}>
          {children}
        </AuthWrapper>
      ) : (
        <>{children}</>
      )}
    </DirectusContext.Provider>
  );
}

const AuthWrapper = ({
  children,
  Unauthenticated,
}: {
  children: ReactNode;
  Unauthenticated?: React.FC;
}) => {
  const client = useDirectusClient();
  const [isLoading, setisLoading] = React.useState(true);
  const [isAuthenticated, setIsAuthenticated] = React.useState<boolean>(true);
  Unauthenticated = Unauthenticated || LoginModal;
  useEffect(() => {
    async function checkLogin() {
      setIsAuthenticated(await client.isLoggedIn());
      setisLoading(false);
    }
    checkLogin();
  }, [client.config.token]);
  return isLoading ? (
    <span>Loading...</span>
  ) : (
    <>
      {children}
      {!isAuthenticated && <Unauthenticated/>}
    </>
  );
};

type Inputs = {
  email: string;
  password: string;
};

export const LoginModal = () => {
  const { register, handleSubmit } = useForm<Inputs>();
  const client = useDirectusClient();
  const onSubmit = async (data: Inputs) => {
    try {
      await client.login({
        ...data,
        ...client.config,
      });
    } catch (error) {
      //TODO catch error
      console.log(error);
    }
  };
  return (
    <ModalLayout name="Reauthenticate">
      <form onSubmit={handleSubmit(onSubmit)}>
        <FieldMeta name="email" label="E-mail">
          <Input name="email" ref={register}></Input>
        </FieldMeta>
        <FieldMeta name="password" label="Password">
          <Input name="password" ref={register}></Input>
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
