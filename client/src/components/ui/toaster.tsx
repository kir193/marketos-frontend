import { Toaster as ChakraToaster, Portal, Spinner, Stack, Toast } from "@chakra-ui/react"
import type { ComponentProps } from "react"

export interface ToasterProps extends ComponentProps<typeof ChakraToaster> {
  toaster: any
}

export function Toaster(props: ToasterProps) {
  const { toaster, ...rest } = props
  
  return (
    <Portal>
      <ChakraToaster toaster={toaster} {...rest}>
        {(toast) => (
          <Toast.Root>
            {toast.type === "loading" ? (
              <Spinner size="sm" color="blue.solid" />
            ) : (
              <Toast.Indicator />
            )}
            <Stack gap="1" flex="1" maxWidth="100%">
              {toast.title && <Toast.Title>{toast.title}</Toast.Title>}
              {toast.description && (
                <Toast.Description>{toast.description}</Toast.Description>
              )}
            </Stack>
            {toast.action && (
              <Toast.ActionTrigger>{toast.action.label}</Toast.ActionTrigger>
            )}
            {toast.meta?.closable && <Toast.CloseTrigger />}
          </Toast.Root>
        )}
      </ChakraToaster>
    </Portal>
  )
}
