"use client";

import { useState } from "react";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm, useFieldArray } from "react-hook-form";
import { Plus, X, Mail, User, Loader2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Form, FormLabel } from "@/components/ui/form";
import { InputFormField } from "@/components/form-fields";
import { Input } from "@/components/ui/input";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Badge } from "@/components/ui/badge";

import { useCurrentTeam, useTeamMembers } from "@/teams/hooks";
import {
  BulkInviteFormValues,
  SingleInviteFormValues,
  bulkInviteSchema,
  singleInviteSchema,
} from "@/teams/validations";

interface InviteMembersModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

// Helper function to detect email format
const isEmailFormat = (value: string) => value.includes("@");

// Helper function to get appropriate icon
const getIdentifierIcon = (value: string) =>
  isEmailFormat(value) ? Mail : User;

// Reusable input field component
interface IdentifierInputProps {
  value: string;
  onChange: (value: string) => void;
  disabled?: boolean;
  placeholder?: string;
}

const IdentifierInput = ({
  value,
  onChange,
  disabled = false,
  placeholder = "Enter email or username",
}: IdentifierInputProps) => {
  const IconComponent = getIdentifierIcon(value);

  return (
    <div className="relative">
      <IconComponent className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground h-4 w-4" />
      <Input
        placeholder={placeholder}
        className="pl-9"
        value={value}
        onChange={(e) => onChange(e.target.value)}
        disabled={disabled}
      />
    </div>
  );
};

// Reusable submit button component
interface SubmitButtonProps {
  isLoading: boolean;
  inviteCount: number;
  children?: React.ReactNode;
}

const SubmitButton = ({
  isLoading,
  inviteCount,
  children,
}: SubmitButtonProps) => (
  <Button type="submit" disabled={isLoading}>
    {isLoading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
    {children ||
      `Send ${inviteCount > 1 ? `${inviteCount} ` : ""}invitation${
        inviteCount > 1 ? "s" : ""
      }`}
  </Button>
);

// Reusable dialog footer component
interface DialogActionsProps {
  onCancel: () => void;
  isLoading: boolean;
  inviteCount?: number;
  submitButtonText?: string;
}

const DialogActions = ({
  onCancel,
  isLoading,
  inviteCount = 1,
  submitButtonText,
}: DialogActionsProps) => (
  <DialogFooter>
    <Button
      type="button"
      variant="outline"
      onClick={onCancel}
      disabled={isLoading}
    >
      Cancel
    </Button>
    <SubmitButton isLoading={isLoading} inviteCount={inviteCount}>
      {submitButtonText}
    </SubmitButton>
  </DialogFooter>
);

// Helper function to transform form values to API payload
const transformToInvitePayload = (identifier: string) =>
  isEmailFormat(identifier) ? { email: identifier } : { username: identifier };

export function InviteMembersModal({
  open,
  onOpenChange,
}: InviteMembersModalProps) {
  const [activeTab, setActiveTab] = useState("single");
  const { currentTeam } = useCurrentTeam();
  const { inviteUser, bulkInvite, isInviting, isBulkInviting } = useTeamMembers(
    currentTeam?.id || ""
  );

  const singleForm = useForm<SingleInviteFormValues>({
    resolver: zodResolver(singleInviteSchema),
    defaultValues: { identifier: "" },
  });

  const bulkForm = useForm<BulkInviteFormValues>({
    resolver: zodResolver(bulkInviteSchema),
    defaultValues: { invitees: [{ identifier: "" }] },
  });

  const { fields, append, remove } = useFieldArray({
    control: bulkForm.control,
    name: "invitees",
  });

  // Unified form reset function
  const resetForms = () => {
    singleForm.reset();
    bulkForm.reset({ invitees: [{ identifier: "" }] });
    setActiveTab("single");
  };

  // Unified success handler
  const handleSuccess = () => {
    resetForms();
    onOpenChange(false);
  };

  const onSingleSubmit = (values: SingleInviteFormValues) => {
    const payload = transformToInvitePayload(values.identifier);
    inviteUser(payload, { onSuccess: handleSuccess });
  };

  const onBulkSubmit = (values: BulkInviteFormValues) => {
    const payload = {
      invitees: values.invitees.map((invitee) =>
        transformToInvitePayload(invitee.identifier)
      ),
    };
    bulkInvite(payload, { onSuccess: handleSuccess });
  };

  const handleOpenChange = (newOpen: boolean) => {
    if (!isInviting && !isBulkInviting) {
      onOpenChange(newOpen);
      if (!newOpen) resetForms();
    }
  };

  const addInvitee = () => append({ identifier: "" });

  const removeInvitee = (index: number) => {
    if (fields.length > 1) remove(index);
  };

  const isAnyFormLoading = isInviting || isBulkInviting;

  return (
    <Dialog open={open} onOpenChange={handleOpenChange}>
      <DialogContent className="sm:max-w-[500px]">
        <DialogHeader>
          <DialogTitle>Invite members to {currentTeam?.name}</DialogTitle>
          <DialogDescription>
            Invite new members to collaborate on your team. They'll receive an
            invitation to join.
          </DialogDescription>
        </DialogHeader>

        <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
          <TabsList className="grid w-full grid-cols-2">
            <TabsTrigger value="single">Single invite</TabsTrigger>
            <TabsTrigger value="bulk">Bulk invite</TabsTrigger>
          </TabsList>

          <TabsContent value="single" className="space-y-4">
            <Form {...singleForm}>
              <form
                onSubmit={singleForm.handleSubmit(onSingleSubmit)}
                className="space-y-4"
              >
                <InputFormField
                  form={singleForm}
                  name="identifier"
                  label="Email or username"
                  renderChild={(field) => (
                    <IdentifierInput
                      value={field.value}
                      onChange={field.onChange}
                      disabled={isAnyFormLoading}
                    />
                  )}
                />

                <DialogActions
                  onCancel={() => handleOpenChange(false)}
                  isLoading={isAnyFormLoading}
                  submitButtonText="Send invitation"
                />
              </form>
            </Form>
          </TabsContent>

          <TabsContent value="bulk" className="space-y-4">
            <Form {...bulkForm}>
              <form
                onSubmit={bulkForm.handleSubmit(onBulkSubmit)}
                className="space-y-4"
              >
                <div className="space-y-3">
                  <div className="flex items-center justify-between">
                    <FormLabel>Invitees</FormLabel>
                    <Button
                      type="button"
                      variant="outline"
                      size="sm"
                      onClick={addInvitee}
                      disabled={isBulkInviting}
                    >
                      <Plus className="mr-2 h-4 w-4" />
                      Add another
                    </Button>
                  </div>

                  <div className="space-y-2 max-h-60 overflow-y-auto">
                    {fields.map((field, index) => (
                      <InputFormField
                        key={field.id}
                        form={bulkForm}
                        name={`invitees.${index}.identifier`}
                        renderChild={(inputField) => (
                          <div className="flex items-center gap-2">
                            <div className="flex-1">
                              <IdentifierInput
                                value={inputField.value as string}
                                onChange={inputField.onChange}
                                disabled={isAnyFormLoading}
                              />
                            </div>
                            {fields.length > 1 && (
                              <Button
                                type="button"
                                variant="ghost"
                                size="sm"
                                onClick={() => removeInvitee(index)}
                                disabled={isAnyFormLoading}
                                className="h-10 w-10 p-0"
                              >
                                <X className="h-4 w-4" />
                              </Button>
                            )}
                          </div>
                        )}
                      />
                    ))}
                  </div>

                  <div className="flex items-center gap-2 text-sm text-muted-foreground">
                    <Badge variant="secondary">{fields.length}</Badge>
                    invitee{fields.length !== 1 ? "s" : ""} to be sent
                  </div>
                </div>

                <DialogActions
                  onCancel={() => handleOpenChange(false)}
                  isLoading={isBulkInviting}
                  inviteCount={fields.length}
                />
              </form>
            </Form>
          </TabsContent>
        </Tabs>
      </DialogContent>
    </Dialog>
  );
}
