// import { useMemo } from 'react';
// import {
//     useReactTable,
//     getCoreRowModel,
//     ColumnDef,
//     flexRender,
// } from '@tanstack/react-table';
//
// interface Contact {
//     date: string;
//     name: string;
//     email: string;
//     phone: string;
// }
//
// const sampleData: Contact[] = [
//     // { date: "2026-02-12 10:00", name: "John Doe", email: "john@example.com", phone: "+123456789" },
// ];
//
// export function ContactsScreen() {
//     const columns = useMemo<ColumnDef<Contact>[]>(
//         () => [
//             { accessorKey: 'date', header: 'Date & Time' },
//             { accessorKey: 'name', header: 'Name' },
//             { accessorKey: 'email', header: 'Email' },
//             { accessorKey: 'phone', header: 'Contact Number' },
//         ],
//         []
//     );
//
//     const table = useReactTable({
//         data: sampleData,
//         columns,
//         getCoreRowModel: getCoreRowModel(),
//     });
//
//     return (
//         <div className="h-full space-y-6">
//             <div>
//                 <h1 className="text-3xl font-bold text-(--color-text-primary)">
//                     Contacts and Leads
//                 </h1>
//                 <p className="text-sm mt-1 text-(--color-text-muted)">
//                     Manage your captured leads and contacts
//                 </p>
//             </div>
//
//             <div className="bg-white rounded-xl p-6 shadow-sm border border-(--color-border) overflow-x-auto">
//                 {sampleData.length === 0 ? (
//                     <div className="text-center py-12 text-(--color-text-muted)">
//                         No contacts yet
//                     </div>
//                 ) : (
//                     <table className="w-full table-auto border-collapse">
//                         <thead>
//                             {table.getHeaderGroups().map((headerGroup) => (
//                                 <tr key={headerGroup.id}>
//                                     {headerGroup.headers.map((header) => (
//                                         <th
//                                             key={header.id}
//                                             className="px-4 py-2 text-left text-(--color-text-secondary) text-sm font-medium border-b border-(--color-border)"
//                                         >
//                                             {flexRender(
//                                                 header.column.columnDef.header,
//                                                 header.getContext()
//                                             )}
//                                         </th>
//                                     ))}
//                                 </tr>
//                             ))}
//                         </thead>
//                         <tbody>
//                             {table.getRowModel().rows.map((row) => (
//                                 <tr key={row.id} className="hover:bg-(--color-bg-glass)">
//                                     {row.getVisibleCells().map((cell) => (
//                                         <td
//                                             key={cell.id}
//                                             className="px-4 py-3 text-(--color-text-primary) text-sm border-b border-(--color-border)"
//                                         >
//                                             {flexRender(
//                                                 cell.column.columnDef.cell,
//                                                 cell.getContext()
//                                             )}
//                                         </td>
//                                     ))}
//                                 </tr>
//                             ))}
//                         </tbody>
//                     </table>
//                 )}
//             </div>
//         </div>
//     );
// }
//
export function ContactsScreen() {
    return (
        <div className="h-full space-y-6">
            <div>
                <h1 className="text-3xl font-bold text-(--color-text-primary)">
                    Contacts and Leads
                </h1>
                <p className="text-sm mt-1 text-(--color-text-muted)">
                    Manage your captured leads and contacts
                </p>
            </div>
        </div>
    );
}
