import { useMemo, useState, useEffect, useCallback } from 'react';
import {
  useReactTable,
  getCoreRowModel,
  getFilteredRowModel,
  getPaginationRowModel,
  type ColumnDef,
  flexRender,
} from '@tanstack/react-table';
import { useNavigate } from 'react-router-dom';
import { Search, Download, ChevronLeft, ChevronRight } from 'lucide-react';
import { getLeads, type Lead } from '../api/client';
import { LoadingSkeleton, TableRowSkeleton } from '../components/LoadingSkeleton';
import { ErrorMessage } from '../components/ErrorMessage';

const PAGE_SIZE = 10;

function exportToCsv(leads: Lead[]) {
  const headers = ['Name', 'Email', 'Phone', 'Captured date', 'Status'];
  const rows = leads.map((l) => [
    l.name ?? '',
    l.email ?? '',
    l.phone_number ?? '',
    l.captured_at ?? '',
    l.status ?? '',
  ]);
  const csv = [headers.join(','), ...rows.map((r) => r.map((c) => `"${String(c).replace(/"/g, '""')}"`).join(','))].join('\n');
  const blob = new Blob([csv], { type: 'text/csv;charset=utf-8;' });
  const url = URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.href = url;
  a.download = `leads-${new Date().toISOString().slice(0, 10)}.csv`;
  a.click();
  URL.revokeObjectURL(url);
}

export function LeadsScreen() {
  const navigate = useNavigate();
  const [leads, setLeads] = useState<Lead[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [search, setSearch] = useState('');
  const [orgFilter, setOrgFilter] = useState('');

  const fetchLeads = useCallback(async () => {
    setLoading(true);
    setError(null);
    const result = await getLeads(orgFilter || undefined);
    setLoading(false);
    if ('error' in result) {
      setError(result.status === 401 ? 'Please sign in to view leads.' : result.error);
      setLeads([]);
      return;
    }
    setLeads(result.data.leads);
  }, [orgFilter]);

  useEffect(() => {
    fetchLeads();
  }, [fetchLeads]);

  const columns = useMemo<ColumnDef<Lead>[]>(
    () => [
      { accessorKey: 'name', header: 'Name', cell: (c) => c.getValue() ?? '—' },
      { accessorKey: 'email', header: 'Email', cell: (c) => c.getValue() ?? '—' },
      { accessorKey: 'phone_number', header: 'Phone', cell: (c) => c.getValue() ?? '—' },
      {
        accessorKey: 'captured_at',
        header: 'Captured date',
        cell: (c) => (c.getValue() ? new Date(c.getValue() as string).toLocaleString() : '—'),
      },
      {
        accessorKey: 'status',
        header: 'Status',
        cell: (c) => String(c.getValue() ?? '—'),
      },
    ],
    []
  );

  const table = useReactTable({
    data: leads,
    columns,
    getCoreRowModel: getCoreRowModel(),
    getFilteredRowModel: getFilteredRowModel(),
    getPaginationRowModel: getPaginationRowModel(),
    initialState: { pagination: { pageSize: PAGE_SIZE } },
    state: { globalFilter: search },
    onGlobalFilterChange: setSearch,
  });

  const filteredCount = table.getFilteredRowModel().rows.length;
  const pageCount = table.getPageCount();

  if (loading && leads.length === 0) {
    return (
      <div className="min-h-full space-y-6">
        <div>
          <h1 className="text-3xl font-bold text-(--color-text-primary)">Leads</h1>
          <p className="text-sm mt-1 text-(--color-text-muted)">Manage your captured leads</p>
        </div>
        <div className="bg-white rounded-xl p-6 shadow-sm border border-(--color-border) overflow-x-auto">
          <table className="w-full table-auto border-collapse">
            <thead>
              <tr>
                <th className="px-4 py-2 text-left text-(--color-text-secondary) text-sm font-medium border-b border-(--color-border)">Name</th>
                <th className="px-4 py-2 text-left text-(--color-text-secondary) text-sm font-medium border-b border-(--color-border)">Email</th>
                <th className="px-4 py-2 text-left text-(--color-text-secondary) text-sm font-medium border-b border-(--color-border)">Phone</th>
                <th className="px-4 py-2 text-left text-(--color-text-secondary) text-sm font-medium border-b border-(--color-border)">Captured date</th>
              </tr>
            </thead>
            <tbody>
              {Array.from({ length: 5 }).map((_, i) => (
                <TableRowSkeleton key={i} cols={4} />
              ))}
            </tbody>
          </table>
        </div>
      </div>
    );
  }

  if (error && leads.length === 0) {
    return (
      <div className="min-h-full space-y-6">
        <div>
          <h1 className="text-3xl font-bold text-(--color-text-primary)">Leads</h1>
          <p className="text-sm mt-1 text-(--color-text-muted)">Manage your captured leads</p>
        </div>
        <ErrorMessage message={error} onRetry={fetchLeads} />
      </div>
    );
  }

  return (
    <div className="min-h-full space-y-6">
      <div>
        <h1 className="text-3xl font-bold text-(--color-text-primary)">Leads</h1>
        <p className="text-sm mt-1 text-(--color-text-muted)">Manage your captured leads</p>
      </div>

      <div className="flex flex-wrap items-center gap-4">
        <div className="relative flex-1 min-w-[200px] max-w-sm">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-(--color-text-muted)" />
          <input
            type="text"
            placeholder="Search name, email, phone..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full pl-9 pr-4 py-2 rounded-lg border border-(--color-border) text-(--color-text-primary) placeholder:text-(--color-text-muted) focus:outline-none focus:border-(--color-border-focus) bg-white"
          />
        </div>
        <input
          type="text"
          placeholder="Filter by org ID (optional)"
          value={orgFilter}
          onChange={(e) => setOrgFilter(e.target.value)}
          className="px-4 py-2 rounded-lg border border-(--color-border) text-(--color-text-primary) placeholder:text-(--color-text-muted) focus:outline-none focus:border-(--color-border-focus) bg-white max-w-[200px]"
        />
        <button
          type="button"
          onClick={fetchLeads}
          disabled={loading}
          className="px-4 py-2 rounded-lg border border-(--color-border) text-(--color-text-primary) hover:bg-(--color-bg-glass) disabled:opacity-50"
        >
          Apply filter
        </button>
        <button
          type="button"
          onClick={() => exportToCsv(table.getFilteredRowModel().rows.map((r) => r.original))}
          disabled={filteredCount === 0}
          className="flex items-center gap-2 px-4 py-2 rounded-lg bg-(--color-primary) text-white hover:opacity-90 disabled:opacity-50 transition-opacity"
        >
          <Download className="w-4 h-4" />
          Export CSV
        </button>
      </div>

      <div className="bg-white rounded-xl shadow-sm border border-(--color-border) overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full table-auto border-collapse">
            <thead>
              {table.getHeaderGroups().map((headerGroup) => (
                <tr key={headerGroup.id}>
                  {headerGroup.headers.map((header) => (
                    <th
                      key={header.id}
                      className="px-4 py-3 text-left text-(--color-text-secondary) text-sm font-medium border-b border-(--color-border)"
                    >
                      {flexRender(header.column.columnDef.header, header.getContext())}
                    </th>
                  ))}
                  <th className="px-4 py-3 text-left text-(--color-text-secondary) text-sm font-medium border-b border-(--color-border) w-24">
                    Actions
                  </th>
                </tr>
              ))}
            </thead>
            <tbody>
              {table.getRowModel().rows.length === 0 ? (
                <tr>
                  <td colSpan={columns.length + 1} className="px-4 py-12 text-center text-(--color-text-muted)">
                    No leads found
                  </td>
                </tr>
              ) : (
                table.getRowModel().rows.map((row) => (
                  <tr
                    key={row.id}
                    className="hover:bg-(--color-bg-glass) border-b border-(--color-border)"
                  >
                    {row.getVisibleCells().map((cell) => (
                      <td
                        key={cell.id}
                        className="px-4 py-3 text-(--color-text-primary) text-sm"
                      >
                        {flexRender(cell.column.columnDef.cell, cell.getContext())}
                      </td>
                    ))}
                    <td className="px-4 py-3">
                      <button
                        type="button"
                        onClick={() => navigate(`/contacts/${row.original.lead_id}`)}
                        className="text-sm text-(--color-primary) hover:underline"
                      >
                        View
                      </button>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
        {pageCount > 1 && (
          <div className="flex items-center justify-between px-4 py-3 border-t border-(--color-border)">
            <span className="text-sm text-(--color-text-muted)">
              Showing {table.getState().pagination.pageIndex * PAGE_SIZE + 1}–{Math.min((table.getState().pagination.pageIndex + 1) * PAGE_SIZE, filteredCount)} of {filteredCount}
            </span>
            <div className="flex items-center gap-2">
              <button
                type="button"
                onClick={() => table.previousPage()}
                disabled={!table.getCanPreviousPage()}
                className="p-2 rounded-lg border border-(--color-border) text-(--color-text-primary) hover:bg-(--color-bg-glass) disabled:opacity-50"
              >
                <ChevronLeft className="w-4 h-4" />
              </button>
              <button
                type="button"
                onClick={() => table.nextPage()}
                disabled={!table.getCanNextPage()}
                className="p-2 rounded-lg border border-(--color-border) text-(--color-text-primary) hover:bg-(--color-bg-glass) disabled:opacity-50"
              >
                <ChevronRight className="w-4 h-4" />
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
