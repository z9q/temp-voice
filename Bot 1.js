const { Client, IntentsBitField, EmbedBuilder, ActionRowBuilder, ButtonBuilder, ButtonStyle, StringSelectMenuBuilder, ChannelType, PermissionsBitField, ModalBuilder, TextInputBuilder, TextInputStyle, UserSelectMenuBuilder } = require('discord.js')
const client = new Client({
    intents: [
        IntentsBitField.Flags.Guilds,
        IntentsBitField.Flags.GuildMessages,
        IntentsBitField.Flags.GuildVoiceStates,
        IntentsBitField.Flags.MessageContent
    ]
})
const chalk = require('chalk')
const express = require('express');

const app = express();

app.get('/', (req, res) => {
  res.send('Hello Express app!')
});

app.listen(3000, () => {
  console.log('server started');
});
app.get('/', async(req, Res) => Res.send('THE DEVELOPERS : Shayeb'))

const db = require('pro.db')
const BotConfig = require('./Bot.json')

client.on('ready', async () => {
    console.log(chalk.blue('The Client has been Connected to : ') + chalk.red(client.user.username))
})


client.on('messageCreate', async Message => {
    if (!BotConfig.OwnersId.includes(Message.author.id)) return;
    if (!Message.content.startsWith(BotConfig.Prefix)) return;
    const Cmd = Message.content.slice(BotConfig.Prefix.length).trim().split(' ')
    const Command = Cmd.shift()
    if (Command == 'setup') {
        Message.delete()
        const Embed = new EmbedBuilder()
            .setAuthor({ name: 'لـوحة تـحكم الـروم الـمؤقت', iconURL: client.user.displayAvatarURL() })
            .setDescription(`**اضـغط على الازرار للـتحكم في الروم**`)
            .setTimestamp()
            .setFooter({ text: Message.guild.name, iconURL: Message.guild.iconURL() })

.setImage("https://media.discordapp.net/attachments/1013147656320729170/1238834030124728401/b434249b02934eafc3d3ccf5cda96ec7.jpg?ex=6640b999&is=663f6819&hm=cf95c9fc6588c9637e17cca89702ccde97585e87717502360ae74bd0d43d82da&")
        const Menu = new StringSelectMenuBuilder()
            .setCustomId('Menu')
            .setMaxValues(1)
            .setMinValues(1)
            .setPlaceholder('عدد الاعضاء داخل الروم')
            .addOptions([
                { label: '0', value: '0' },
                { label: '1', value: '1' },
                { label: '2', value: '2' },
                { label: '3', value: '3' },
                { label: '4', value: '4' },
                { label: '5', value: '5' },
                { label: '10', value: '10' },
                { label: '15', value: '15' },
                { label: '20', value: '20' },
                { label: '25', value: '25' },
                { label: '30', value: '30' },
                { label: '35', value: '35' },
                { label: '40', value: '40' },
                { label: '45', value: '45' },
                { label: '50', value: '50' },
                { label: '55', value: '55' },
                { label: '60', value: '60' },
                { label: '65', value: '65' }
            ])
        
        const RowOne = new ActionRowBuilder()
            .addComponents(
                new ButtonBuilder()
                    .setStyle(ButtonStyle.Secondary)
                    .setEmoji('1238839975634665552')
                    .setLabel('ٖ')
                    .setCustomId('LockChannel'),
                new ButtonBuilder()
                    .setStyle(ButtonStyle.Secondary)
                    .setEmoji('1238839756230758492')
                    .setLabel('ٖ')
                    .setCustomId('UnlockChannel'), )
      
        const RowTwo = new ActionRowBuilder()
            .addComponents(
                new ButtonBuilder()
                    .setStyle(ButtonStyle.Secondary)
                    .setEmoji('1238839684105244692')
                     .setLabel('ٖ')
                    .setCustomId('Customize_UserLimit'),
                new ButtonBuilder()
                    .setStyle(ButtonStyle.Danger)
                    .setEmoji('1238839053487575050')
                    .setLabel('ٖ')
                    .setCustomId('Disconnect'))
        const RowThree = new ActionRowBuilder()
            .addComponents(
                new ButtonBuilder()
                    .setStyle(ButtonStyle.Secondary)
                    .setEmoji('1085174405895835699')
                    .setLabel('ٖ')
                    .setCustomId('UsersManager'),
                new ButtonBuilder()
                    .setStyle(ButtonStyle.Primary)
                    .setEmoji('1238839916532727869')
                    .setLabel('ٖ')
                    .setCustomId('Delete_Channel'),
                    new ButtonBuilder()
                    .setStyle(ButtonStyle.Primary)
                    .setEmoji('1238839614442049639')
                    .setLabel('ٖ')
                    .setCustomId('RenameChannel')
            )
        const RowFour = new ActionRowBuilder()
            .addComponents([Menu])
        Message.channel.send({ embeds: [Embed], components: [RowOne, RowTwo, RowThree, RowFour] })
    }
})

client.on('voiceStateUpdate', async (OldVoice, NewVoice) => {
    if (NewVoice.channelId == BotConfig.ChannelId) {
        await NewVoice.guild.channels.create({
            name: `${NewVoice.member.user.username}`,
            type: ChannelType.GuildVoice,
            parent: BotConfig.CategoryId || NewVoice.member.voice.channel.parentId,
            userLimit: BotConfig.MaxUsers || NewVoice.member.voice.channel.userLimit
        }).then(async Channel => {
            db.set(`Temporary_${Channel.id}_${OldVoice.member.user.id}`, Channel.id)
            await NewVoice.member.voice.setChannel(Channel)
        })
    }

    setInterval(async () => {
        if (OldVoice.channelId !== null && db.has(`Temporary_${OldVoice.channelId}_${OldVoice.member.user.id}`)) {
            if (OldVoice.channel.members.filter(x => !x.user.bot).size == 0) {
                let channel = OldVoice.guild.channels.cache.get(OldVoice.channelId)
                await channel.delete();
                await db.delete(`Temporary_${OldVoice.channelId}_${OldVoice.member.user.id}`);
            }
        }
    }, 1000)
})

client.on('interactionCreate', async Interaction => {
    if (Interaction.isButton()) {
        const Channel = Interaction.member.voice.channel;
        if (!Channel) return Interaction.reply({ content: `انت ليس داخل الروم`, ephemeral: true })
        const Data = db.get(`Temporary_${Channel.id}_${Interaction.user.id}`)
        if (Data !== Channel.id) return Interaction.reply({ content: `أنت لست مالكا إذا كانت القناة مؤقتة `, ephemeral: true })
        switch (Interaction.customId) {
            case 'LockChannel': {
                await Interaction.deferUpdate().catch(() => { })
                Interaction.member.voice.channel.permissionOverwrites.set([
                    {
                        id: Interaction.guild.roles.everyone.id,
                        deny: [
                            PermissionsBitField.Flags.Connect
                        ]
                    },
                    {
                        id: Interaction.user.id,
                        allow: [
                            PermissionsBitField.Flags.Connect
                        ]
                    }
                ])
            }
                break;
            case 'UnlockChannel': {
                await Interaction.deferUpdate().catch(() => { })
                Interaction.member.voice.channel.permissionOverwrites.set([
                    {
                        id: Interaction.guild.roles.everyone.id,
                        allow: [
                            PermissionsBitField.Flags.Connect
                        ]
                    }
                ])
            }
                break;
            case 'HideChannel': {
                await Interaction.deferUpdate().catch(() => { })
                Interaction.member.voice.channel.permissionOverwrites.set([
                    {
                        id: Interaction.guild.roles.everyone.id,
                        deny: [
                            PermissionsBitField.Flags.ViewChannel
                        ]
                    },
                    {
                        id: Interaction.user.id,
                        allow: [
                            PermissionsBitField.Flags.ViewChannel
                        ]
                    }
                ])
            }
                break;
            case 'UnhideChannel': {
                await Interaction.deferUpdate().catch(() => { })
                Interaction.member.voice.channel.permissionOverwrites.set([
                    {
                        id: Interaction.guild.roles.everyone.id,
                        allow: [
                            PermissionsBitField.Flags.ViewChannel
                        ]
                    }
                ])
            }
                break;
            case 'RenameChannel': {
                const Modal = new ModalBuilder()
                    .setCustomId('RenameModal')
                    .setTitle('تغيير اسم الروم')
                const Name = new TextInputBuilder()
                    .setStyle(TextInputStyle.Short)
                    .setLabel('الاسم الجديد')
                    .setMaxLength(50)
                    .setCustomId('Name')
                    .setRequired(true)
                const Row = new ActionRowBuilder().addComponents(Name)
                Modal.addComponents(Row)
                Interaction.showModal(Modal)
            }
                break;
            case 'Mute': {
                await Interaction.deferUpdate().catch(() => { })
                Channel.members.forEach(async Members => {
                    const Member = Interaction.guild.members.cache.get(Members.id)
                    if (Member.id !== Interaction.user.id) Member.voice.setMute(true)
                })
            }
                break;
            case 'Unmute': {
                await Interaction.deferUpdate().catch(() => { })
                Channel.members.forEach(async Members => {
                    const Member = Interaction.guild.members.cache.get(Members.id)
                    if (Member.id !== Interaction.user.id) Member.voice.setMute(false)
                })
            }
                break;
            case 'Disconnect': {
                await Interaction.deferUpdate().catch(() => { })
                Channel.members.forEach(async Members => {
                    const Member = Interaction.guild.members.cache.get(Members.id)
                    if (Member.id !== Interaction.user.id) Member.voice.disconnect()
                })
            }
                break;
            case 'Delete_Channel': {
                await Interaction.deferUpdate().catch(() => { })
                db.delete(`Temporary_${Channel.id}_${Interaction.user.id}`)
                await Channel.delete()
            }
                break;
            case 'Ban_Member': {
                const User = new UserSelectMenuBuilder().setPlaceholder('Select the User').setCustomId('UserMenu').setMaxValues(1)
                const Row = new ActionRowBuilder().addComponents(User)
                Interaction.reply({ content: `_ _`, components: [Row], ephemeral: true })
            }
                break;
            case 'UsersManager': {
                const Row = new ActionRowBuilder().addComponents(
                    new ButtonBuilder()
                        .setStyle(ButtonStyle.Secondary)
                        .setEmoji('1238848753075748864')
                        .setLabel('ٖ')
                        .setCustomId('UsersManager_Mute'),
                    new ButtonBuilder()
                        .setStyle(ButtonStyle.Secondary)
                        .setEmoji('1238846149721591868')
                        .setLabel('ٖ')
                        .setCustomId('UsersManager_Unmute'),
                    new ButtonBuilder()
                        .setStyle(ButtonStyle.Secondary)
                        .setEmoji('1238846026698326126')
                        .setLabel('ٖ')
                        .setCustomId('UsersManager_Deafen'),
                    new ButtonBuilder()
                        .setStyle(ButtonStyle.Secondary)
                        .setEmoji('1238846084621533224')
                        .setLabel('ٖ')
                        .setCustomId('UsersManager_Undeafen'))
                Interaction.reply({ content: '_ _', components: [Row], ephemeral: true })
            }
                break;
            case 'Customize_UserLimit': {
                const Modal = new ModalBuilder()
                    .setCustomId('Customize_UsersLimit')
                    .setTitle('Customize Users Limit')
                const Number = new TextInputBuilder()
                    .setStyle(TextInputStyle.Short)
                    .setLabel('The Number')
                    .setMaxLength(2)
                    .setCustomId('The_Number')
                    .setRequired(true)
                const Row = new ActionRowBuilder().addComponents(Number)
                Modal.addComponents(Row)
                Interaction.showModal(Modal)
            }
        }
    } else if (Interaction.isStringSelectMenu()) {
        const Channel = Interaction.member.voice.channel;
        if (!Channel) return Interaction.reply({ content: `انت ليس داخل الروم`, ephemeral: true })
        const Data = db.get(`Temporary_${Channel.id}_${Interaction.user.id}`)
        if (Data !== Channel.id) return Interaction.reply({ content: `أنت لست مالكا إذا كانت القناة المؤقتة `, ephemeral: true })
        if (Interaction.customId == 'Menu') {
            await Interaction.deferUpdate().catch(() => { })
            if (Interaction.guild.channels.cache.get(Channel.id).type === ChannelType.GuildVoice) {
                Interaction.guild.channels.cache.get(Channel.id).setUserLimit(Interaction.values[0])
            }
        }
    } else if (Interaction.isModalSubmit()) {
        const Channel = Interaction.member.voice.channel;
        if (!Channel) return Interaction.reply({ content: `انت ليس داخل الروم`, ephemeral: true })
        const Data = db.get(`Temporary_${Channel.id}_${Interaction.user.id}`)
        if (Data !== Channel.id) return Interaction.reply({ content: `انت لست مالكا اذا كانت القناة مؤقتة`, ephemeral: true })
        if (Interaction.customId == 'RenameModal') {
            const Name = Interaction.fields.getTextInputValue('Name')
            await Channel.setName(Name)
            Interaction.reply({ content: `تم تغيير اسم الروم`, ephemeral: true })
        } else if (Interaction.customId == 'Customize_UsersLimit') {
            const Number = Interaction.fields.getTextInputValue('The_Number')
            if (Channel.userLimit == Number) return Interaction.reply({ content: `الحد الأقصى للمستخدمين موجود بالفعل \`${Number}\``, ephemeral: true })
            Interaction.reply({ content: `تم تغيير عدد الاعضاء من \`${Channel.userLimit || '0'}\` الى \`${Number}\``, ephemeral: true })
            await Channel.setUserLimit(Number)
        }
    }
})

/* Users Manager */

client.on('interactionCreate', async Interaction => {
    if (Interaction.isButton()) {
        const Channel = Interaction.member.voice.channel;
        if (!Channel) return Interaction.reply({ content: `انت لست داخل الروم`, ephemeral: true })
        const Data = db.get(`Temporary_${Channel.id}_${Interaction.user.id}`)
        if (Data !== Channel.id) return Interaction.reply({ content: `أنت لست مالكا إذا كانت القناة المؤقتة`, ephemeral: true })
        switch (Interaction.customId) {
            case 'UsersManager_Mute': {
                const Row = new ActionRowBuilder()
                    .addComponents(
                        new UserSelectMenuBuilder()
                            .setPlaceholder('اختر العضو من القائمة')
                            .setCustomId('UserManager_Mute')
                            .setMaxValues(1)
                    )
                Interaction.reply({ content: '_ _', components: [Row], ephemeral: true })
            }
                break;
            case 'UsersManager_Unmute': {
                const Row = new ActionRowBuilder()
                    .addComponents(
                        new UserSelectMenuBuilder()
                            .setPlaceholder('اختر العضو من القائمة')
                            .setCustomId('UserManager_Unmute')
                            .setMaxValues(1))
                Interaction.reply({ content: '_ _', components: [Row], ephemeral: true })
            }
                break;
            case 'UsersManager_Deafen': {
                const Row = new ActionRowBuilder()
                    .addComponents(
                        new UserSelectMenuBuilder()
                            .setPlaceholder('اختر العضو من القائمة')
                            .setCustomId('UserManager_Deafen')
                            .setMaxValues(1)
                    )
                Interaction.reply({ content: '_ _', components: [Row], ephemeral: true })
            }
                break;
            case 'UsersManager_Undeafen': {
                const Row = new ActionRowBuilder()
                    .addComponents(
                        new UserSelectMenuBuilder()
                            .setPlaceholder('اختر العضو من القائمة')
                            .setCustomId('UserManager_Undeafen')
                            .setMaxValues(1)
                    )
                Interaction.reply({ content: '_ _', components: [Row], ephemeral: true })
            }
        }
    } else if (Interaction.isUserSelectMenu()) {
        const Channel = Interaction.member.voice.channel;
        if (!Channel) return Interaction.reply({ content: `انت لست داخل الروم`, ephemeral: true })
        const Data = db.get(`Temporary_${Channel.id}_${Interaction.user.id}`)
        if (Data !== Channel.id) return Interaction.reply({ content: `أنت لست مالكا إذا كانت القناة المؤقتة `, ephemeral: true })
        switch (Interaction.customId) {
            case 'UserManager_Mute': {
                await Interaction.deferUpdate().catch(() => { })
                Interaction.member.voice.channel.members.filter((Member) => Member.user.id == Interaction.values[0]).forEach((User) => {
                    const Member = Interaction.guild.members.cache.get(User.id)
                    Member.voice.setMute(true)
                })
            }
                break;
            case 'UserManager_Unmute': {
                await Interaction.deferUpdate().catch(() => { })
                Interaction.member.voice.channel.members.filter((Member) => Member.user.id == Interaction.values[0]).forEach((User) => {
                    const Member = Interaction.guild.members.cache.get(User.id)
                    Member.voice.setMute(false)
                })
            }
                break;
            case 'UserManager_Deafen': {
                await Interaction.deferUpdate().catch(() => { })
                Interaction.member.voice.channel.members.filter((Member) => Member.user.id == Interaction.values[0]).forEach((User) => {
                    const Member = Interaction.guild.members.cache.get(User.id)
                    Member.voice.setDeaf(true)
                })
            }
                break;
            case 'UserManager_Undeafen': {
                await Interaction.deferUpdate().catch(() => { })
                Interaction.member.voice.channel.members.filter((Member) => Member.user.id == Interaction.values[0]).forEach((User) => {
                    const Member = Interaction.guild.members.cache.get(User.id)
                    Member.voice.setDeaf(false)
                })
            }
        }
    }
})


client.login(process.env.token).catch(() => {
    console.log(chalk.red('The Token is not valid'))
})
process.on('uncaughtException', async () => { return })
process.on('uncaughtExceptionMonitor', async () => { return })
process.on('unhandledRejection', async () => { return })