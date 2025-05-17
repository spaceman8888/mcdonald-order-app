import { supabase } from './supabase';
import { MenuCategory, MenuItem, MenuOption } from '../types/index';

// 메뉴 카테고리 조회
export const getMenuCategories = async() : Promise<MenuCategory[]> =>{
    const {data, error} = await supabase
    .from('menu_categories')
    .select('*')
    .order('display_order', {ascending:true});

    if(error){
        console.error('메뉴 카테고리 조회 실패:', error);
        throw error;
    }
    return data || [];
}

// 카테고리별 메뉴 아이템 조회
export const getMenuItemsByCategory = async(categoryId:number) : Promise<MenuItem[]> =>{
    const {data, error} = await supabase
    .from('menu_items')
    .select('*')
    .eq('category_id', categoryId)
    .eq('is_available', true);

    if(error){
        console.error('메뉴 아이템 조회 실패:', error);
        throw error;
    }
    return data || [];
}

// 메뉴 아이템 상세 정보 조회
export const getMenuItemDetails = async(menuItemId:number) =>{
    // 메뉴 아이템 정보 조회
    const {data : menuItem, error:menuItemError} = await supabase
    .from('menu_items')
    .select('*')
    .eq('id', menuItemId)
    .single();

    if(menuItemError){
        console.error('메뉴 아이템 상세 정보 조회 실패:', menuItemError);
        throw menuItemError;
    }

    // 해당 메뉴의 옵션 카테고리 조회
    const {data:optionCategories, error:optionCategoriesError} = await supabase
    .from('menu_item_option_categories')
    .select(`
        option_category_id,
        option_categories(id,name,description)    
    `)
    .eq('menu_item_id', menuItemId)

    if(optionCategoriesError){
        console.error('옵션 카테고리 조회 실패:', optionCategoriesError);
        throw optionCategoriesError;
    }

    // 각 옵션 카테고리별 옵션 조회
    const optionsWithDetails = await Promise.all(
        optionCategories.map(async (oc) => {
        const { data: options, error: opError } = await supabase
            .from('menu_options')
            .select('*')
            .eq('category_id', oc.option_category_id)
            .order('display_order', { ascending: true });

        if (opError) {
            console.error('Error fetching menu options:', opError);
            throw opError;
        }

        return {
            category: oc.option_categories,
            options: options || [],
        };
        })
    );

    return {
        ...menuItem,
        optionCategories: optionsWithDetails,
    };
    
}

// 메뉴 검색
export const searchMenuItems = async(query:string) : Promise<MenuItem[]> =>{
    const {data, error} = await supabase
    .from('menu_items')
    .select('*')
    .or(`name.ilike.%${query}%,description.ilike.%${query}%`)
    .eq('is_available', true)

    if(error){
        console.error('메뉴 검색 실패:', error);
        throw error;
    }
    return data || [];
}