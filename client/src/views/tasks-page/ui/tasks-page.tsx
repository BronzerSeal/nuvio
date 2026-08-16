"use client";

import { useMemo, useState } from "react";
import { Table, type TableColumn } from "@shared/ui/table";
import { Main } from "@/shared/ui/main";
import { useCompanyTasksCount, useCompanyTasksHook } from "@/entity/company";
import { useParams } from "next/navigation";
import { StatusBadge } from "../model/status-badge";

export default function TasksPage() {
  const [selected, setSelected] = useState<string[]>([]);

  const { companyId } = useParams() as { companyId?: string };
  const { tasks, cursor } = useCompanyTasksHook(companyId!, !!companyId);
  const { data: tasksCount } = useCompanyTasksCount(companyId!, !!companyId);

  const columns = useMemo<TableColumn<any>[]>(
    () => [
      {
        key: "name",
        header: "Name",
        sortable: true,
        width: "1.4fr",
        cell: (row) => (
          <span className="font-medium">{row?.assignee?.name}</span>
        ),
      },
      {
        key: "email",
        header: "Email",
        width: "1fr",
        cell: (row) => (
          <span className="font-medium">{row?.assignee?.email}</span>
        ),
      },
      { key: "title", width: "600px", header: "Title" },
      {
        key: "status",
        header: "Status",
        width: "130px",
        sortable: true,
        cell: (row) => <StatusBadge status={row.status} />,
      },
      {
        key: "priority",
        header: "Priority",
        sortable: true,
        align: "right",
        width: "110px",
        cell: (row) => (
          <span className="tabular-nums font-bolder">{row.priority}</span>
        ),
      },
    ],
    [],
  );

  return (
    <Main>
      <div className="flex w-full flex-col gap-2 max-w-screen">
        <div className="flex items-center justify-between px-1 text-muted-foreground text-xs">
          <h1 className="text-2xl font-bold tracking-tight">Tasks</h1>
          <span>{tasksCount?.count ?? 0} rows</span>
          {selected.length > 0 ? (
            <span>{selected.length.toLocaleString()} selected</span>
          ) : null}
        </div>
        <Table
          data={tasks ?? []}
          columns={columns}
          selectable
          resizable
          reorderable
          selectedRowIds={selected}
          onSelectionChange={setSelected}
          defaultSort={{ key: "mrr", direction: "desc" }}
          height={"100%"}
          rowHeight={52}
          className="rounded-2xl"
        />
      </div>
      {cursor}
    </Main>
  );
}
