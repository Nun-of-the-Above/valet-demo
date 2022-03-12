import { useForm } from "react-hook-form";
import { functions } from "../../firestore";
import { httpsCallable } from "@firebase/functions";
import { Input } from "@chakra-ui/react";
import { Button } from "@chakra-ui/button";
import { Stack } from "@chakra-ui/layout";
import {
  Drawer,
  DrawerBody,
  DrawerFooter,
  DrawerHeader,
  DrawerOverlay,
  DrawerContent,
  DrawerCloseButton,
} from "@chakra-ui/react";
import { FormLabel } from "@chakra-ui/react";

export function CreateSessionForm({ isOpen, onClose, btnRef }) {
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm();

  const onSubmit = (data) => createSession(data);

  // ? This could be made local and batched?
  // Would get rid of all the cold starts of it.
  const createSession = httpsCallable(functions, "createSession");

  return (
    <Drawer
      isOpen={isOpen}
      placement="left"
      onClose={onClose}
      finalFocusRef={btnRef}
      size="md"
    >
      <DrawerOverlay />
      <DrawerContent>
        <DrawerCloseButton />
        <DrawerHeader>Skapa ny föreställning</DrawerHeader>
        <DrawerBody>
          <form onSubmit={handleSubmit(onSubmit)}>
            <Stack spacing="5">
              <FormLabel htmlFor="showDate">Datum och tid</FormLabel>
              <Input
                {...register("showDate", { required: true })}
                name="showDate"
                type="datetime-local"
                defaultValue="2022-02-11T18:00"
              />
              {errors.showDate && <span>Detta måste vara med.</span>}

              <FormLabel htmlFor="stage">Scen</FormLabel>
              <Input
                {...register("stage", { required: true })}
                placeholder="Scen46, Oscarsteatern etc..."
                name="stage"
                type="text"
                defaultValue="Scen46"
              />
              {errors.stage && <span>Detta måste vara med.</span>}

              <FormLabel htmlFor="city">Stad</FormLabel>
              <Input
                {...register("city", { required: true })}
                placeholder="Stad"
                name="city"
                type="text"
                defaultValue="Göteborg"
              />
              {errors.city && <span>Detta måste vara med.</span>}

              <FormLabel htmlFor="secretWord">Hemligt ord</FormLabel>
              <Input
                {...register("secretWord", { required: true })}
                placeholder="Ordet användarna loggar in i appen med."
                name="secretWord"
                type="text"
                defaultValue="falukorv"
              />
              {errors.secretWord && <span>Detta måste vara med.</span>}

              <Button type="submit" variant="solid" onClick={onClose}>
                SKAPA FÖRESTÄLLNING
              </Button>
            </Stack>
          </form>
        </DrawerBody>

        <DrawerFooter>
          <Button variant="outline" mr={3} onClick={onClose}>
            Stäng
          </Button>
        </DrawerFooter>
      </DrawerContent>
    </Drawer>
  );
}
