/** @format */

'use client';
import { useEffect, useState } from 'react';
import {
	getStorageById,
	updateStorageItem,
	createStorageItem,
} from '@/lib/fetching';
import {
	Dialog,
	DialogContent,
	DialogHeader,
	DialogTitle,
	DialogTrigger,
} from '../ui/dialog';
import { Input } from '../ui/input';
import { Button } from '../ui/button';
import { CardTitle } from '../ui/card';
import { EditIcon, PlusIcon } from 'lucide-react';
import { Textarea } from '../ui/textarea';
import { useRouter } from 'next/navigation';
import { Label } from '../ui/label';

const initialForm = {
	name: '',
	type: 'Unit',
	quantity: 0,
	shortageLimit: 0,
	price: 0,
	seller: '',
};

export default function ItemForm({ id }: { id?: string }) {
	const [item, setItem] = useState<any>(null);
	const [form, setForm] = useState<any>(initialForm);
	const [loading, setLoading] = useState(false);
	const [error, setError] = useState('');
	const isEdit = !!id;
	const route = useRouter();

	useEffect(() => {
		if (id) {
			getStorageById(id).then((data) => {
				setItem(data);
				setForm({
					...data,
					buyDate: data?.buyDate
						? new Date(data.buyDate).toISOString().slice(0, 10)
						: '',
				});
			});
		} else {
			setForm(initialForm);
		}
	}, [id]);

	const handleChange = (
		e: React.ChangeEvent<
			HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement
		>
	) => {
		const { name, value } = e.target;
		setForm((f: any) => ({
			...f,
			[name]:
				name === 'quantity' || name === 'price' || name === 'shortageLimit'
					? Number(value)
					: value,
		}));
	};

	const handleSubmit = async (e: React.FormEvent) => {
		e.preventDefault();
		setLoading(true);
		setError('');
		try {
			if (isEdit) {
				await updateStorageItem(id!, form);
			} else {
				await createStorageItem(form);
				setForm(initialForm);
			}
			route.refresh();
			setLoading(false);
		} catch (err) {
			setError('Failed to save item');
			console.log('Error saving item:', err);

			setLoading(false);
		}
	};

	return (
		<Dialog>
			<DialogTrigger>
				{isEdit ? (
					<EditIcon className='hover:scale-110 transform duration-500 active:text-primary text-xl' />
				) : (
					<p className='inline-flex py-1.5 px-2 font-semibold cursor-pointer items-center justify-center whitespace-nowrap rounded-bl-md rounded-tr-md transform duration-300 text-sm transition-colors focus-visible:outline-hidden focus-visible:ring-1 focus-visible:ring-ring disabled:pointer-events-none disabled:opacity-50 text-primary-foreground shadow-sm dark:hover:from-secondary/80 hover:from-secondary/70 dark:hover:to-secondary/70 hover:to-secondary/90 bg-linear-to-b from-secondary/60 to-primary/100 dark:from-primary/100 dark:to-primary/70 border-t-primary'>
						<PlusIcon className='hover:scale-110 transform duration-500 active:text-primary text-xl' />{' '}
						Add Item
					</p>
				)}
			</DialogTrigger>
			<DialogContent>
				<DialogHeader>
					<DialogTitle>
						<CardTitle>{isEdit ? 'Update Item' : 'Create Item'}</CardTitle>
					</DialogTitle>
				</DialogHeader>
				<form
					onSubmit={handleSubmit}
					className='grid grid-cols-2 gap-4 mt-2'>
					<div>
						<Label htmlFor='name'>Name</Label>
						<Input
							id='name'
							name='name'
							value={form.name || ''}
							onChange={handleChange}
							placeholder='Name'
							required
						/>
					</div>
					<div>
						<Label htmlFor='type'>Type</Label>
						<select
							id='type'
							name='type'
							value={form.type || 'Ubit'}
							onChange={handleChange}
							className='border rounded px-2 py-1 w-full'
							required>
							<option value='Gram'>Gram</option>
							<option value='Milliliter'>Milliliter</option>
							<option value='Unit'>Unit</option>
						</select>
					</div>
					<div>
						<Label htmlFor='quantity'>Quantity</Label>
						<Input
							id='quantity'
							name='quantity'
							type='number'
							value={form.quantity ?? ''}
							onChange={handleChange}
							placeholder='Quantity'
							required
						/>
					</div>
					<div>
						<Label htmlFor='shortageLimit'>Shortage Limit</Label>
						<Input
							id='shortageLimit'
							name='shortageLimit'
							type='number'
							value={form.shortageLimit ?? 0}
							onChange={handleChange}
							placeholder='Shortage limit'
							required
						/>
					</div>
					<div>
						<Label htmlFor='price'>Price</Label>
						<Input
							id='price'
							name='price'
							type='number'
							value={form.price ?? ''}
							onChange={handleChange}
							placeholder='Price'
							required
						/>
					</div>
					<div className='col-span-2'>
						<Label htmlFor='seller'>Seller</Label>
						<Textarea
							id='seller'
							name='seller'
							value={form.seller || ''}
							onChange={handleChange}
							placeholder='Seller'
						/>
					</div>
					{error && <div className='text-red-500 col-span-2'>{error}</div>}
					<Button
						type='submit'
						disabled={loading}
						className='col-span-2'>
						{loading
							? isEdit
								? 'Updating...'
								: 'Creating...'
							: isEdit
							? 'Update'
							: 'Create'}
					</Button>
				</form>
			</DialogContent>
		</Dialog>
	);
}
