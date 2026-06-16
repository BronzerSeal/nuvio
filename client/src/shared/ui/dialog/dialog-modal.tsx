import {
  Dialog,
  DialogPanel,
  DialogHeader,
  DialogFooter,
  DialogTitle,
  DialogDescription,
} from "./dialog-headless";

type ModalProps = {
  open: boolean;
  onClose: () => void;
  title: string;
  description?: string;
  children: React.ReactNode;
};

export const Modal = ({
  open,
  onClose,
  title,
  description,
  children,
}: ModalProps) => {
  return (
    <Dialog open={open} onClose={onClose}>
      <DialogPanel showCloseButton className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>{title}</DialogTitle>

          {description && <DialogDescription>{description}</DialogDescription>}
        </DialogHeader>

        {children}
      </DialogPanel>
    </Dialog>
  );
};
