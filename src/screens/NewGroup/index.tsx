import { useState } from "react";
import { Alert } from "react-native";
import { useNavigation } from "@react-navigation/native";

import { groupCreate } from "@storage/group/groupCreate";

import { AppError } from "@utils/AppError";

import { Button } from "@components/Button";
import { Header } from "@components/Header";
import { Highlight } from "@components/Highlight";
import { Input } from "@components/Input";

import { Container,Content, Icon } from "./styles";

export function NewGroup(){
    const [group, setGroup] = useState('')
    const navigation = useNavigation();

    async function handleNewGroup(){
        try {
            if(group.trim().length === 0){
                return Alert.alert('New Group','provide the name of the group')
            }

            await groupCreate(group)
            navigation.navigate('players', { group });
        } catch (error) {
            if(error instanceof AppError){
                Alert.alert('New Group',error.message)
            } else {
                Alert.alert('New Group', 'unable to create a new group')
                console.log(error);
            }
        }
    }
    return(
        <Container>
            <Header showBackButton />
            <Content>
                <Icon />
                <Highlight
                    title="Nova Turma"
                    subtitle="crie uma turma para adicionar pessoas"
                />
                <Input
                    placeholder="Nome da turma"
                    onChangeText={setGroup}
                />
                <Button
                    title="Criar" 
                    style={{ marginTop: 20 }}
                    onPress={handleNewGroup}
                />

            </Content>
        </Container>
    )
}